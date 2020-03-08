import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import { fetchingClosestStationsStatus } from '../actions/station-status';
import { Observable } from 'rxjs';
import { currentPosition } from '../reducers/position';
import { filter, take } from 'rxjs/operators';
import { StationStatus } from '../services/api.service';
import { stationsStatus, isLoading } from '../reducers/station-status';

@Component({
  selector: 'app-departure',
  templateUrl: './departure.component.html',
  styleUrls: ['./departure.component.scss']
})
export class DepartureComponent implements OnInit {
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
