import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { selectingStation, unselectStationMap, setMapCenter } from '../actions/stations-map';
import { Station, Coordinate } from '../interfaces';
import { AppState } from '../reducers';
import { getCurrentPosition } from '../reducers/galileo';
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

  chartType: ChartType = 'Pie';
  chartData: IChartistData;
  chartOptions: IPieChartOptions = {
    donut: true,
    donutSolid: true,
  };
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
        filter(event => event instanceof NavigationEnd),
      ),
    ]).pipe(
      map(([position, val]) => val),
      takeUntil(this.destroy$),
    ).subscribe((val: NavigationEnd) => {
      this.selectStationFct(+val.url.split('/')[2]);
    });

    this.selectedStation$
      .pipe(filter(Boolean), takeUntil(this.destroy$))
      .subscribe((selectedStation: Station) => {
        this.store.dispatch(setMapCenter({
          lat: selectedStation.lat,
          lng: selectedStation.lng,
        }));

        this.chartData = {
          labels: ['mécanique', 'ebike', 'station'],
          series: [
            [selectedStation.mechanical],
            [selectedStation.ebike],
            [selectedStation.numDocksAvailable]
          ],
        };

        this.chartOptions = {
          ...this.chartOptions,
          total: selectedStation.ebike + selectedStation.mechanical + selectedStation.numDocksAvailable,
        };
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
    let position: Coordinate;
    this.currentPosition$.pipe(take(1)).subscribe((cp) => { position = cp; });
    this.store.dispatch(setMapCenter(position));
    this.store.dispatch(unselectStationMap());

    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
