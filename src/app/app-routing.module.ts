import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArrivalComponent } from './arrival/arrival.component';
import { DepartureComponent } from './departure/departure.component';
import { StationDescriptionComponent } from './station-description/station-description.component';

const routes: Routes = [
  { path: 'stations/:stationId', component: StationDescriptionComponent },
  { path: 'departure', component: DepartureComponent },
  { path: 'departure/:stationId', component: DepartureComponent },
  { path: 'arrival', component: ArrivalComponent },
  { path: 'arrival/:stationId', component: ArrivalComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
