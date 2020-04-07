import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArrivalComponent } from './arrival/arrival.component';
import { DepartureComponent } from './departure/departure.component';
import { StationDescriptionComponent } from './station-description/station-description.component';

const routes: Routes = [
  { path: 'stations/:stationId', component: StationDescriptionComponent, data: { routeName: 'StationDescription' } },
  { path: 'departure', component: DepartureComponent, data: { routeName: 'Departure' } },
  { path: 'departure/:stationId', component: DepartureComponent, data: { routeName: 'DepartureItinerary' } },
  {
    path: 'departure/:stationId/description',
    component: StationDescriptionComponent,
    data: { routeName: 'DepartureItineraryDescription' },
  },
  { path: 'arrival', component: ArrivalComponent, data: { routeName: 'Arrival' } },
  { path: 'arrival/:stationId', component: ArrivalComponent, data: { routeName: 'ArrivalItinerary'} },
  {
    path: 'arrival/:stationId/description',
    component: StationDescriptionComponent,
    data: { routeName: 'ArrivalItineraryDescription' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
