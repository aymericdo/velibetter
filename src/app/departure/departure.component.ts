import { AppState } from '../reducers';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { fetchingClosestStations } from '../actions/stations-list';
import { filter, take } from 'rxjs/operators';
import { getCurrentPosition } from '../reducers/galileo';
import { getIsLoading, getStationsStatus } from '../reducers/stations-list';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { Station } from '../interfaces';

@Component({
  selector: 'app-departure',
  templateUrl: './departure.component.html',
  styleUrls: ['./departure.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartureComponent implements OnInit {
  currentPosition$: Observable<{ lat: number; lng: number }>;
  stationsStatus$: Observable<Station[]>;
  isLoading$: Observable<boolean>;

  constructor(private store: Store<AppState>) {
    this.currentPosition$ = store.pipe(select(getCurrentPosition));
    this.stationsStatus$ = store.pipe(select(getStationsStatus), filter(s => !!s.length));
    this.isLoading$ = store.pipe(select(getIsLoading));
  }

  ngOnInit(): void {
    this.currentPosition$
      .pipe(filter(Boolean), take(1))
      .subscribe((position: { lat: number; lng: number }) => {
        this.store.dispatch(fetchingClosestStations({ isDeparture: true }));
      });
  }

  trackByFn(index: number, station: Station): number {
    return station.stationId;
  }
}
