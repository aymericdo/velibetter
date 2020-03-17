import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, combineLatest, Subject } from 'rxjs';
import { Station, Coordinate } from '../interfaces';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import { currentPosition } from '../reducers/position';
import { selectedStation, isSelectingStation } from '../reducers/stations-map';
import { filter, map, withLatestFrom, takeUntil, take } from 'rxjs/operators';
import { selectingStation } from '../actions/stations-map';
import { Router, NavigationEnd, Event } from '@angular/router';

@Component({
  selector: 'app-station-description',
  templateUrl: './station-description.component.html',
  styleUrls: ['./station-description.component.scss']
})
export class StationDescriptionComponent implements OnInit, OnDestroy {
  currentPosition$: Observable<{ lat: number; lng: number }>;
  selectedStation$: Observable<Station>;
  isSelectingStation$: Observable<boolean>;
  routerUrl: string;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store<AppState>,
    private router: Router,
  ) {
    this.selectedStation$ = store.pipe(select(selectedStation));
    this.currentPosition$ = store.pipe(select(currentPosition));
    this.isSelectingStation$ = store.pipe(select(isSelectingStation));
    this.routerUrl = router.url;

    combineLatest([
      this.currentPosition$.pipe(filter(Boolean)),
      router.events.pipe(
        filter(event =>
          event instanceof NavigationEnd
        )
      ),
    ]).pipe(
      map(([position, val]) => val),
      takeUntil(this.destroy$),
    ).subscribe((val: NavigationEnd) => {
      this.selectStationFct(+val.url.split('/')[2]);
    });
  }

  ngOnInit(): void {
    this.currentPosition$.pipe(filter(Boolean), take(1))
      .subscribe((position) => {
        this.selectStationFct(+this.routerUrl.split('/')[2]);
      });
  }

  selectStationFct(stationId: number): void {
    this.store.dispatch(selectingStation({ stationId }));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
