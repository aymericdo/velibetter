import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StationStatus } from '../services/api.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import { currentPosition } from '../reducers/position';
import { stationsStatus } from '../reducers/station-status';
import { isLoading } from '../reducers/station-info';
import { filter, take } from 'rxjs/operators';
import { fetchingClosestStationsStatus } from '../actions/station-status';

@Component({
  selector: 'app-arrival',
  templateUrl: './arrival.component.html',
  styleUrls: ['./arrival.component.scss']
})
export class ArrivalComponent implements OnInit {
  currentPosition$: Observable<{ lat: number; lng: number }>;
  stationsStatus$: Observable<StationStatus[]>;
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
        this.store.dispatch(fetchingClosestStationsStatus(position));
      });
  }

}
