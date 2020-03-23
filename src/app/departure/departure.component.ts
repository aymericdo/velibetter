import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { fetchingClosestStations } from '../actions/stations-list';
import { Station } from '../interfaces';
import { AppState } from '../reducers';
import { getCurrentPosition } from '../reducers/position';
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

  chartWidth = 0;
  chartHeight = 0;
  chartShowLabels = false;
  chartShowLegend = false;
  chartData = [
    {
      name: "score",
      value: 69
    },
    {
      name: "empty",
      value: 31
    }];

  constructor(
    private store: Store<AppState>
  ) {
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

    this.stationsStatus$
      .pipe(filter(status => !!status.length), take(1))
      .subscribe(() => {
        setTimeout(() => {
          this.chartHeight = this.rowContent.first.nativeElement.offsetHeight;
        });
      });
  }
}
