import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepartureComponent } from './departure/departure.component';
import { ArrivalComponent } from './arrival/arrival.component';

const routes: Routes = [
  { path: 'departure', component: DepartureComponent },
  { path: 'departure/:stationId', redirectTo: '' },
  { path: 'arrival', component: ArrivalComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
