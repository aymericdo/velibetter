import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { routerTransition } from '../animations/route-animations';
import { AppState } from '../reducers';
import { getIsMobile } from '../reducers/screen';

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss'],
  animations: [routerTransition],
})
export class ItineraryComponent implements OnInit {
  isMobile$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
  ) {
    this.isMobile$ = store.pipe(select(getIsMobile));
  }

  ngOnInit() {
  }
}
