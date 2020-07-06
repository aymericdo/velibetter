import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { selectingStation, unselectStationMap } from '../actions/stations-map';
import { routerTransition } from '../animations/route-animations';
import { Coordinate } from '../interfaces';
import { AppState } from '../reducers';
import { getCurrentPosition, getIsNoGeolocation } from '../reducers/galileo';
import { getIsMobile } from '../reducers/screen';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss'],
  animations: [routerTransition],
})
export class StationComponent implements OnInit, OnDestroy {
  currentPosition$: Observable<Coordinate>;
  isNoGeolocation$: Observable<boolean>;
  isMobile$: Observable<boolean>;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.currentPosition$ = store.pipe(select(getCurrentPosition));
    this.isNoGeolocation$ = store.pipe(select(getIsNoGeolocation));
    this.isMobile$ = store.pipe(select(getIsMobile));
  }

  ngOnInit() {
    combineLatest([
      this.currentPosition$.pipe(filter(Boolean), take(1)),
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
      ),
    ]).pipe(
      map(([position, val]) => val),
      takeUntil(this.destroy$),
    ).subscribe((val: NavigationEnd) => {
      this.selectStationFct(+this.activatedRoute.snapshot.paramMap.get('stationId'));
    });

    combineLatest([
      this.isNoGeolocation$.pipe(filter(Boolean), take(1)),
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
      ),
    ]).pipe(
      map(([position, val]) => val),
      takeUntil(this.destroy$),
    ).subscribe((val: NavigationEnd) => {
      this.selectStationFct(+this.activatedRoute.snapshot.paramMap.get('stationId'));
    });

    this.currentPosition$.pipe(filter(Boolean), take(1))
      .subscribe((position) => {
        this.selectStationFct(+this.activatedRoute.snapshot.paramMap.get('stationId'));
      });

    this.isNoGeolocation$.pipe(filter(Boolean), take(1))
      .subscribe((isNoGeolocation) => {
        this.selectStationFct(+this.activatedRoute.snapshot.paramMap.get('stationId'));
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
