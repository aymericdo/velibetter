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
  isScoreDisplayed = false;

  constructor(private store: Store<AppState>) {
    this.currentPosition$ = store.pipe(select(getCurrentPosition));
    this.stationsStatus$ = store.pipe(select(getStationsStatus), filter(s => !!s.length));
    this.isLoading$ = store.pipe(select(getIsLoading));
  }

  ngOnInit(): void {
    this.currentPosition$
      .pipe(filter(Boolean), take(1))
      .subscribe((position: { lat: number; lng: number }) => {
        this.store.dispatch(fetchingClosestStations({ isDeparture: false }));
      });

    this.stationsStatus$
      .pipe(take(1))
      .subscribe((stations: Station[]) => {
        setTimeout(() => {
          this.isScoreDisplayed = true;
        }, 1000);
        // Never under 500 sadly ^
      });
  }

  trackByFn(index: number, station: Station): number {
    return station.stationId;
  }
}
