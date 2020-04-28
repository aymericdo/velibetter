import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fetchingDestination, unsetDestination } from '../actions/stations-list';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import { Observable } from 'rxjs';
import { getCurrentPosition } from '../reducers/galileo';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss']
})
export class ItineraryComponent implements OnInit {
  currentPosition$: Observable<{
    lat: number;
    lng: number;
  }>;
  itineraryType: string;
  destinationId: number;

  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
  ) {
    this.currentPosition$ = store.pipe(select(getCurrentPosition));
  }

  ngOnInit() {
    this.itineraryType = this.activatedRoute.snapshot.paramMap.get('itineraryType');
    const destinationId = +this.activatedRoute.snapshot.paramMap.get('destinationId');

    if (destinationId) {
      this.currentPosition$
        .pipe(filter(Boolean), take(1))
        .subscribe((position) => {
          this.store.dispatch(fetchingDestination({ itineraryType: this.itineraryType, stationId: destinationId }));
        });
    } else {
      this.store.dispatch(unsetDestination());
    }
  }
}
