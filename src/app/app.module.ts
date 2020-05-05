import { AgmCoreModule } from '@agm/core';
import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AgmDirectionModule } from 'agm-direction';
import { FlatpickrModule } from 'angularx-flatpickr';
import { ChartistModule } from 'ng-chartist';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppEffects } from './app.effects';
import { ArrivalComponent } from './arrival/arrival.component';
import { DepartureComponent } from './departure/departure.component';
import { HoursSelectorComponent } from './dialogs/hours-selector/hours-selector.dialog';
import { ItineraryTypeChoiceListComponent } from './dialogs/itinerary-type-choice-list/itinerary-type-choice-list.dialog';
import { TimePickerComponent } from './dialogs/time-picker/time-picker.dialog';
import { ItineraryMapComponent } from './itinerary-map/itinerary-map.component';
import { ItineraryComponent } from './itinerary/itinerary.component';
import { MapComponent } from './map/map.component';
import { metaReducers, reducers } from './reducers';
import { DoughnutChartComponent } from './shared/doughnut-chart/doughnut-chart.component';
import { InfiniteScrollComponent } from './shared/infinite-scroll/infinite-scroll.component';
import { ListButtonComponent } from './shared/list-button/list-button.component';
import { ListComponent } from './shared/list/list.component';
import { LoadingComponent } from './shared/loading/loading.component';
import { RowStationComponent } from './shared/row-station/row-station.component';
import { ScoreDoughnutChartComponent } from './shared/score-doughnut-chart/score-doughnut-chart.component';
import { SpeedDialFabComponent } from './shared/speed-dial-fab/speed-dial-fab.component';
import { StationDescriptionComponent } from './station/station-description/station-description.component';
import { StationFeedbackComponent } from './station/station-feedback/station-feedback.component';
import { StationComponent } from './station/station.component';
import { TopBarComponent } from './top-bar/top-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    SpeedDialFabComponent,
    DepartureComponent,
    ArrivalComponent,
    ListComponent,
    MapComponent,
    LoadingComponent,
    StationDescriptionComponent,
    DoughnutChartComponent,
    ScoreDoughnutChartComponent,
    RowStationComponent,
    TimePickerComponent,
    ListButtonComponent,
    TopBarComponent,
    StationFeedbackComponent,
    ItineraryComponent,
    StationComponent,
    ItineraryMapComponent,
    ItineraryTypeChoiceListComponent,
    InfiniteScrollComponent,
    HoursSelectorComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    ChartistModule,
    HttpClientModule,
    LayoutModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatIconModule,
    MatDialogModule,
    MatBottomSheetModule,
    MatListModule,
    MatMomentDateModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatCardModule,
    MatSidenavModule,
    MatToolbarModule,
    FormsModule,
    FlatpickrModule.forRoot(),
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
    AgmDirectionModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    }),
    EffectsModule.forRoot([AppEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
