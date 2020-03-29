import { AppState } from '../reducers';
import { ChartType } from 'ng-chartist';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { fetchingClosestStations } from '../actions/stations-list';
import { filter, take } from 'rxjs/operators';
import { getCurrentPosition } from '../reducers/galileo';
import { getIsLoading, getStationsStatus } from '../reducers/stations-list';
import { IPieChartOptions } from 'chartist';
import { Observable } from 'rxjs';
import { Station } from '../interfaces';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-arrival',
  templateUrl: './arrival.component.html',
  styleUrls: ['./arrival.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArrivalComponent implements OnInit {
  currentPosition$: Observable<{ lat: number; lng: number }>;
  stationsStatus$: Observable<Station[]>;
  isLoading$: Observable<boolean>;

  chartType: ChartType = 'Pie';
  chartOptions: IPieChartOptions = {
    donut: true,
    donutWidth: 5,
    showLabel: false,
    total: 100
  };

  constructor(private store: Store<AppState>) {
    this.currentPosition$ = store.pipe(select(getCurrentPosition));
    this.stationsStatus$ = store.pipe(select(getStationsStatus));
    this.isLoading$ = store.pipe(select(getIsLoading));
  }

  ngOnInit(): void {
    this.currentPosition$
      .pipe(filter(Boolean), take(1))
      .subscribe((position: { lat: number; lng: number }) => {
        this.store.dispatch(fetchingClosestStations({ isDeparture: false }));
      });
  }

  getChartData(score: number) {
    return {
        labels: ['score', 'empty'],
        series: [[score], [100 - score]]
      };
  }

  trackByFn(index: number, station: Station): number {
    return station.stationId;
  }
}
