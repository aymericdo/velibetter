import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { fetchingClosestStations } from '../actions/stations-list';
import { Station } from '../interfaces';
import { AppState } from '../reducers';
import { getCurrentPosition } from '../reducers/galileo';
import { getCurrentDelta, getIsLoading, getStationsStatus } from '../reducers/stations-list';

@Component({
  selector: 'app-arrival',
  templateUrl: './arrival.component.html',
  styleUrls: ['./arrival.component.scss'],
})
export class ArrivalComponent implements OnInit {
  currentPosition$: Observable<{ lat: number; lng: number }>;
  stationsStatus$: Observable<Station[]>;
  isLoading$: Observable<boolean>;
  currentDelta$: Observable<string>;

  constructor(private store: Store<AppState>) {
    this.currentPosition$ = store.pipe(select(getCurrentPosition));
    this.stationsStatus$ = store.pipe(select(getStationsStatus));
    this.isLoading$ = store.pipe(select(getIsLoading));
    this.currentDelta$ = store.pipe(
      select(getCurrentDelta),
      map(delta =>
        delta ?
          moment().isSame(moment().add(delta, 'hour'), 'day') ?
            moment().add(delta, 'hour').format('HH:00')
          :
            moment().add(delta, 'hour').format('DD/MM HH:00')
        :
          null
      ),
    );
  }

  ngOnInit(): void {
    this.currentPosition$
      .pipe(filter(Boolean), take(1))
      .subscribe((position: { lat: number; lng: number }) => {
        this.store.dispatch(fetchingClosestStations({ isDeparture: false }));
      });
  }

  trackByFn(index: number, station: Station): number {
    return station.stationId;
  }

  refresh() {
    this.store.dispatch(
      fetchingClosestStations({
        isDeparture: false,
      }),
    );
  }

  removeDelta() {
    this.store.dispatch(
      fetchingClosestStations({
        isDeparture: true,
      })
    );
  }

  selectedDateTime(delta: number) {
    this.store.dispatch(
      fetchingClosestStations({
        isDeparture: false,
        delta,
      }),
    );
  }
}
