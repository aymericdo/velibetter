import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { selectingStation } from '../actions/stations-map';
import { Station } from '../interfaces';
import { AppState } from '../reducers';
import { getCurrentPosition } from '../reducers/position';
import { getIsSelectingStation, getSelectedStation } from '../reducers/stations-map';
import { ChartType, ChartEvent } from 'ng-chartist';
import { IChartistData, IPieChartOptions } from 'chartist';

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

  total: number;
  ebike: number;
  mechanical: number;
  docks: number;

  chartType: ChartType = 'Pie';
  chartData: IChartistData ;
  chartOptions: IPieChartOptions;
  chartEvents: ChartEvent = {};

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
    this.selectedStation$.pipe(filter(Boolean), take(1))
      .subscribe((station: Station) => {
        let total = station.ebike + station.mechanical + station.numDocksAvailable;
        this.chartData = {
          labels: ['mécanique', 'ebike', 'station'],
          series: [
            [station.mechanical],
            [station.ebike],
            [station.numDocksAvailable]
          ]
        };
        this.chartOptions = {
          donut: true,
          chartPadding: 15,
          labelOffset: 40,
          donutSolid: true,
          donutWidth: 30,
          showLabel: true,
          total
        };
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
