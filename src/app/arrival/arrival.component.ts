import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Station } from '../interfaces';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import { getCurrentPosition } from '../reducers/galileo';
import { getStationsStatus } from '../reducers/stations-list';
import { getIsLoading } from '../reducers/stations-map';
import { filter, take } from 'rxjs/operators';
import { fetchingClosestStations } from '../actions/stations-list';

@Component({
  selector: 'app-arrival',
  templateUrl: './arrival.component.html',
  styleUrls: ['./arrival.component.scss']
})
export class ArrivalComponent implements OnInit {
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
        this.store.dispatch(fetchingClosestStations({ isDeparture: false }));
      });
  }

}
