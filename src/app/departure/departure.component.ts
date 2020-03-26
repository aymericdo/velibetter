import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { IPieChartOptions } from 'chartist';
import { ChartEvent, ChartType } from 'ng-chartist';
import { Observable } from 'rxjs';
import { getCurrentPosition } from '../reducers/galileo';
import { filter, take } from 'rxjs/operators';
import { fetchingClosestStations } from '../actions/stations-list';
import { Station } from '../interfaces';
import { AppState } from '../reducers';
import { getIsLoading, getStationsStatus } from '../reducers/stations-list';

@Component({
  selector: 'app-departure',
  templateUrl: './departure.component.html',
  styleUrls: ['./departure.component.scss']
})
export class DepartureComponent implements OnInit {
  @ViewChildren('rowContent') rowContent: QueryList<ElementRef>;

  currentPosition$: Observable<{ lat: number; lng: number }>;
  stationsStatus$: Observable<Station[]>;
  isLoading$: Observable<boolean>;

  chartType: ChartType = 'Pie';
  chartOptions: IPieChartOptions = {
    donut: true,
    donutSolid: true,
    donutWidth: 5,
    showLabel: false,
    total: 100
  };
  chartEvents: ChartEvent = {};

  constructor(private store: Store<AppState>) {
    this.currentPosition$ = store.pipe(select(getCurrentPosition));
    this.stationsStatus$ = store.pipe(select(getStationsStatus));
    this.isLoading$ = store.pipe(select(getIsLoading));
  }

  ngOnInit(): void {
    this.currentPosition$
      .pipe(filter(Boolean), take(1))
      .subscribe((position: { lat: number; lng: number }) => {
        this.store.dispatch(fetchingClosestStations({ isDeparture: true }));
      });
  }

  getChartData(score: number) {
    return {
        labels: ['score', 'empty'],
        series: [[score], [100 - score]]
      };
  }
}
