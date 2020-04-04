import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { fetchingClosestStations } from '../actions/stations-list';
import { Station } from '../interfaces';
import { AppState } from '../reducers';
import { getCurrentPosition } from '../reducers/galileo';
import { getIsLoading, getStationsStatus } from '../reducers/stations-list';


@Component({
  selector: 'app-departure',
  templateUrl: './departure.component.html',
  styleUrls: ['./departure.component.scss']
})
export class DepartureComponent implements OnInit {
  currentPosition$: Observable<{
    lat: number;
    lng: number;
  }>;
  stationsStatus$: Observable<Station[]>;
  isLoading$: Observable<boolean>;

  constructor(private store: Store<AppState>, private cdr: ChangeDetectorRef) {
    this.currentPosition$ = store.pipe(select(getCurrentPosition));
    this.stationsStatus$ = store.pipe(select(getStationsStatus));
    this.isLoading$ = store.pipe(select(getIsLoading));
  }

  ngOnInit(): void {
    this.currentPosition$
      .pipe(filter(Boolean), take(1))
      .subscribe((position: { lat: number; lng: number }) => {
        this.store.dispatch(
          fetchingClosestStations({
            isDeparture: true
          })
        );
      });
  }

  trackByFn(index: number, station: Station): number {
    return station.stationId;
  }

  refresh() {
    this.store.dispatch(
      fetchingClosestStations({
        isDeparture: true
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
