import { Component, OnInit } from '@angular/core';
import { fetchingStations } from './actions/stations';
import { Store, select } from '@ngrx/store';
import { AppState } from './reducers';
import { isLoading, markers, Marker } from './reducers/stations';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Velibetter';
  markers$: Observable<Marker[]>;
  isLoading$: Observable<boolean>;

  lat = 48.859889;
  lng = 2.346878;
  zoom = 13;

  constructor(
    private store: Store<AppState>,
  ) {
    this.isLoading$ = store.pipe(select(isLoading));
    this.markers$ = store.pipe(select(markers));
  }

  ngOnInit() {
    this.store.dispatch(fetchingStations());
  }
}
