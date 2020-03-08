import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import { fetchingClosestStationsStatus } from '../actions/stations';
import { Observable } from 'rxjs';
import { currentPosition } from '../reducers/position';
import { filter, take } from 'rxjs/operators';
import { StationStatus } from '../services/api.service';
import { stationsStatus } from '../reducers/stations';

@Component({
  selector: 'app-departure',
  templateUrl: './departure.component.html',
  styleUrls: ['./departure.component.scss']
})
export class DepartureComponent implements OnInit {
  currentPosition$: Observable<{ lat: number; lng: number }>;
  stationsStatus$: Observable<StationStatus[]>;

  constructor(
    private store: Store<AppState>
  ) {
    this.currentPosition$ = store.pipe(select(currentPosition));
    this.stationsStatus$ = store.pipe(select(stationsStatus));
  }

  ngOnInit(): void {
    this.currentPosition$
      .pipe(filter(Boolean), take(1))
      .subscribe((position: { lat: number; lng: number }) => {
        console.log('tamere');
        this.store.dispatch(fetchingClosestStationsStatus(position));
      });
  }
}
