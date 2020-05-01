import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../animations/route-animations';

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss'],
  animations: [routerTransition],
})
export class ItineraryComponent implements OnInit {
  constructor(
  ) {
  }

  ngOnInit() {
  }
}
