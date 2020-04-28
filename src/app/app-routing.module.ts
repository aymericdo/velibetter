import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StationDescriptionComponent } from './station-description/station-description.component';
import { StationFeedbackComponent } from './station-feedback/station-feedback.component';
import { ItineraryComponent } from './itinerary/itinerary.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
    data: { routeName: 'Root', isFullMap: true },
  },
  {
    path: 'stations',
    redirectTo: '',
  },
  {
    path: 'stations/:stationId',
    component: StationDescriptionComponent,
    data: { routeName: 'StationDescription' },
    children: [
      {
        path: 'feedback',
        component: StationFeedbackComponent,
        data: { routeName: 'StationDescriptionFeedback' },
      },
    ]
  },
  {
    path: 'itinerary',
    redirectTo: '',
  },
  {
    path: 'itinerary/:itineraryType',
    component: ItineraryComponent,
    data: { routeName: 'ItineraryList' },
  },
  {
    path: 'itinerary/:itineraryType/:destinationId',
    component: ItineraryComponent,
    data: { routeName: 'ItineraryMap', isFullMap: true },
  },
  {
    path: 'itinerary/:itineraryType/:destinationId/description',
    redirectTo: 'itinerary/:itineraryType/:destinationId',
  },
  {
    path: 'itinerary/:itineraryType/:destinationId/description/:stationId',
    component: StationDescriptionComponent,
    data: { routeName: 'ItineraryDescription' },
    children: [
      {
        path: 'feedback',
        component: StationFeedbackComponent,
        data: { routeName: 'ItineraryDescriptionFeedback' },
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
