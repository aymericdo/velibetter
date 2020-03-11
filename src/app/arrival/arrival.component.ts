import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Station } from '../interfaces';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import { currentPosition } from '../reducers/position';
import { stationsStatus } from '../reducers/stations-list';
import { isLoading } from '../reducers/stations-map';
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
    this.currentPosition$ = store.pipe(select(currentPosition));
    this.stationsStatus$ = store.pipe(select(stationsStatus));
    this.isLoading$ = store.pipe(select(isLoading));
  }

  ngOnInit(): void {
    this.currentPosition$
      .pipe(filter(Boolean), take(1))
      .subscribe((position: { lat: number; lng: number }) => {
        this.store.dispatch(fetchingClosestStations({ isDeparture: false }));
      });
  }

}
