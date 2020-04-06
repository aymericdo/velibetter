import { AppState } from '../reducers';
import { Component, OnInit } from '@angular/core';
import { fetchingClosestStations } from '../actions/stations-list';
import { filter, take } from 'rxjs/operators';
import { getCurrentPosition } from '../reducers/galileo';
import { getIsLoading, getStationsStatus } from '../reducers/stations-list';
import { Observable } from 'rxjs';
import { Station } from '../interfaces';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-arrival',
  templateUrl: './arrival.component.html',
  styleUrls: ['./arrival.component.scss'],
})
export class ArrivalComponent implements OnInit {
  currentPosition$: Observable<{ lat: number; lng: number }>;
  stationsStatus$: Observable<Station[]>;
  isLoading$: Observable<boolean>;

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

  trackByFn(index: number, station: Station): number {
    return station.stationId;
  }

  refresh() {
    this.store.dispatch(
      fetchingClosestStations({
        isDeparture: false
      })
    );
  }

  selectedTime(time: Date) {
    const currentDate = new Date();
    const timeDifference = time.getTime() - currentDate.getTime();
    const timeDifferenceInHours = Math.floor(timeDifference / (1000 * 3600));
    this.store.dispatch(
      fetchingClosestStations({
        isDeparture: false,
        delta: timeDifferenceInHours
      })
    );
  }
}
