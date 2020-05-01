import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { fetchingDestination, unsetDestination } from '../actions/stations-list';
import { AppState } from '../reducers';
import { getCurrentPosition } from '../reducers/galileo';
import { ItineraryType } from '../reducers/stations-list';

@Component({
  selector: 'app-itinerary-map',
  templateUrl: './itinerary-map.component.html',
  styleUrls: ['./itinerary-map.component.scss']
})
export class ItineraryMapComponent implements OnInit, OnDestroy {
  currentPosition$: Observable<{
    lat: number;
    lng: number;
  }>;
  itineraryType: ItineraryType;
  destinationId: number;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.currentPosition$ = store.pipe(select(getCurrentPosition));
  }

  ngOnInit() {
    this.itineraryType = this.activatedRoute.snapshot.paramMap.get('itineraryType') as ItineraryType;
    const destinationId = +this.activatedRoute.snapshot.paramMap.get('destinationId');

    if (!['departure', 'arrival'].includes(this.itineraryType) && destinationId) {
      this.router.navigate(['/']);
    }

    this.currentPosition$
      .pipe(filter(Boolean), take(1))
      .subscribe((position) => {
        this.store.dispatch(fetchingDestination({ itineraryType: this.itineraryType, stationId: destinationId }));
      });
  }

  ngOnDestroy(): void {
    this.store.dispatch(unsetDestination());
  }
}
