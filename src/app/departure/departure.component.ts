import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import { fetchingClosestStations } from '../actions/stations-list';
import { Observable } from 'rxjs';
import { getCurrentPosition } from '../reducers/galileo';
import { filter, take } from 'rxjs/operators';
import { Station } from '../interfaces';
import { getStationsStatus, getIsLoading } from '../reducers/stations-list';

@Component({
  selector: 'app-departure',
  templateUrl: './departure.component.html',
  styleUrls: ['./departure.component.scss']
})
export class DepartureComponent implements OnInit {
  currentPosition$: Observable<{ lat: number; lng: number }>;
  stationsStatus$: Observable<Station[]>;
  isLoading$: Observable<boolean>;

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
  }
}
