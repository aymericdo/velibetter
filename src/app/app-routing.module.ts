import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArrivalComponent } from './arrival/arrival.component';
import { DepartureComponent } from './departure/departure.component';
import { ItineraryMapComponent } from './itinerary-map/itinerary-map.component';
import { ItineraryComponent } from './itinerary/itinerary.component';
import { StationDescriptionComponent } from './station/station-description/station-description.component';
import { StationFeedbackComponent } from './station/station-feedback/station-feedback.component';
import { StationComponent } from './station/station.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
    data: { routeName: 'Root', isFullMap: true },
  },
  {
    path: 'about',
    component: AboutComponent,
    data: { routeName: 'AboutUs', animation: 'About' },
  },
  {
    path: 'stations',
    redirectTo: '',
  },
  {
    path: 'stations/:stationId',
    component: StationComponent,
    children: [
      {
        path: '',
        component: StationDescriptionComponent,
        data: { routeName: 'StationDescription', animation: 'Description' },
      },
      {
        path: 'feedback',
        component: StationFeedbackComponent,
        data: { routeName: 'StationDescriptionFeedback', animation: 'Feedback' },
      },
    ],
  },
  {
    path: 'itinerary',
    redirectTo: '',
  },
  {
    path: 'itinerary',
    component: ItineraryComponent,
    children: [
      {
        path: 'departure',
        component: DepartureComponent,
        data: { routeName: 'Departure', animation: 'Itinerary' },
      },
      {
        path: 'arrival',
        component: ArrivalComponent,
        data: { routeName: 'Arrival', animation: 'Itinerary' },
      },
      {
        path: ':itineraryType/:destinationId',
        component: ItineraryMapComponent,
        data: { routeName: 'ItineraryMap', isFullMap: true, animation: 'ItineraryMap' },
      },
    ],
  },
  {
    path: 'itinerary/:itineraryType/:destinationId/description',
    redirectTo: 'itinerary/:itineraryType/:destinationId',
  },
  {
    path: 'itinerary/:itineraryType/:destinationId/description/:stationId',
    component: StationComponent,
    children: [
      {
        path: '',
        component: StationDescriptionComponent,
        data: { routeName: 'ItineraryDescription', animation: 'Description' },
      },
      {
        path: 'feedback',
        component: StationFeedbackComponent,
        data: { routeName: 'ItineraryDescriptionFeedback', animation: 'Feedback' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    // { enableTracing: true },
  )],
  exports: [RouterModule],
})
export class AppRoutingModule { }
