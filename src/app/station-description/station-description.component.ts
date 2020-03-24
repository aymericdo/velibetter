import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { selectingStation, unselectStationMap } from '../actions/stations-map';
import { Station } from '../interfaces';
import { AppState } from '../reducers';
import { getCurrentPosition } from '../reducers/galileo';
import { getIsSelectingStation, getSelectedStation } from '../reducers/stations-map';

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
    this.selectedStation$ = store.pipe(select(getSelectedStation));
    this.currentPosition$ = store.pipe(select(getCurrentPosition));
    this.isSelectingStation$ = store.pipe(select(getIsSelectingStation));
    this.routerUrl = router.url;

    combineLatest([
      this.currentPosition$.pipe(filter(Boolean), take(1)),
      router.events.pipe(
        filter(event =>
          event instanceof NavigationEnd
        ),
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
    this.store.dispatch(unselectStationMap());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
