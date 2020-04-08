import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArrivalComponent } from './arrival/arrival.component';
import { DepartureComponent } from './departure/departure.component';
import { StationDescriptionComponent } from './station-description/station-description.component';
import { StationFeedbackComponent } from './station-feedback/station-feedback.component';

const routes: Routes = [
  {
    path: 'stations/:stationId',
    component: StationDescriptionComponent,
    data: { routeName: 'StationDescription' },
  },
  {
    path: 'stations/:stationId/feedback',
    component: StationFeedbackComponent,
    data: { routeName: 'StationDescriptionFeedback' },
  },
  {
    path: 'departure',
    component: DepartureComponent,
    data: { routeName: 'Departure' },
  },
  {
    path: 'departure/:stationId',
    component: DepartureComponent,
    data: { routeName: 'DepartureItinerary' },
  },
  {
    path: 'departure/:stationId/description',
    component: StationDescriptionComponent,
    data: { routeName: 'DepartureItineraryDescription' },
  },
  {
    path: 'departure/:stationId/description/feedback',
    component: StationFeedbackComponent,
    data: { routeName: 'DepartureItineraryDescriptionFeedback' },
  },
  {
    path: 'arrival', component:
    ArrivalComponent,
    data: { routeName: 'Arrival' },
  },
  {
    path: 'arrival/:stationId', component:
    ArrivalComponent,
    data: { routeName: 'ArrivalItinerary'},
  },
  {
    path: 'arrival/:stationId/description',
    component: StationDescriptionComponent,
    data: { routeName: 'ArrivalItineraryDescription' },
  },
  {
    path: 'arrival/:stationId/description/feedback',
    component: StationDescriptionComponent,
    data: { routeName: 'ArrivalItineraryDescriptionFeedback' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
