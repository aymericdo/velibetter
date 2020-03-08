import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, metaReducers } from './reducers';
import { AgmCoreModule } from '@agm/core';
import { AppEffects } from './app.effects';
import { DepartureComponent } from './departure/departure.component';
import { ArrivalComponent } from './arrival/arrival.component';
import { SpeedDialFabComponent } from './shared/speed-dial-fab/speed-dial-fab.component';
import { ListComponent } from './shared/list/list.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MapComponent } from './map/map.component';
import { LoadingComponent } from './shared/loading/loading.component';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    AppComponent,
    SpeedDialFabComponent,
    DepartureComponent,
    ArrivalComponent,
    ListComponent,
    MapComponent,
    LoadingComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    LayoutModule,
    MatButtonModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSidenavModule,
    MatToolbarModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    }),
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    EffectsModule.forRoot([AppEffects]),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCcsw2lr7StRPLt0nv3KybPFtT0U4hzyks'
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    }),
    EffectsModule.forRoot([AppEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
