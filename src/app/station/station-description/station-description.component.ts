import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { IChartistData, IPieChartOptions } from 'chartist';
import ChartistTooltip from 'chartist-plugin-tooltips-updated';
import { ChartType } from 'ng-chartist';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { setMapCenter } from 'src/app//actions/stations-map';
import { ItineraryTypeChoiceListComponent } from 'src/app/dialogs/itinerary-type-choice-list/itinerary-type-choice-list.dialog';
import { Station } from 'src/app/interfaces';
import { AppState } from 'src/app/reducers';
import { getIsNoGeolocation } from 'src/app/reducers/galileo';
import { ItineraryType } from 'src/app/reducers/stations-list';
import { getIsSelectingStation, getSelectedStation } from 'src/app/reducers/stations-map';

@Component({
  selector: 'app-station-description',
  templateUrl: './station-description.component.html',
  styleUrls: ['./station-description.component.scss'],
})
export class StationDescriptionComponent implements OnInit, OnDestroy {
  selectedStation$: Observable<Station>;
  isSelectingStation$: Observable<boolean>;
  isNoGeolocation$: Observable<boolean>;

  chartType: ChartType = 'Pie';
  chartData: IChartistData;
  chartOptions: IPieChartOptions = {
    donut: true,
    labelInterpolationFnc: (value: string, idx: number) => {
      if (this.chartData.series[idx] > 0) {
        return value;
      } else {
        return '';
      }
    },
    plugins: [
      ChartistTooltip({
        anchorToPoint: true,
        appendToBody: true,
        class: 'ct-tooltip'
      })
    ]
  };

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private bottomSheet: MatBottomSheet,
    private store: Store<AppState>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.selectedStation$ = store.pipe(select(getSelectedStation));
    this.isSelectingStation$ = store.pipe(select(getIsSelectingStation));
    this.isNoGeolocation$ = store.pipe(select(getIsNoGeolocation));
  }

  ngOnInit(): void {
    this.selectedStation$
      .pipe(filter(Boolean), takeUntil(this.destroy$))
      .subscribe((selectedStation: Station) => {
        this.store.dispatch(setMapCenter({
          lat: selectedStation.lat,
          lng: selectedStation.lng,
        }));

        this.chartData = {
          labels: [
            selectedStation.mechanical > 1 ? 'mécaniques' : 'mécanique',
            selectedStation.ebike > 1 ? 'ebikes' : 'ebike',
            selectedStation.numDocksAvailable > 1 ? 'places vides' : 'place vide',
          ],
          series: [[selectedStation.mechanical], [selectedStation.ebike], [selectedStation.numDocksAvailable]],
        };

        this.chartOptions = {
          ...this.chartOptions,
          total: selectedStation.mechanical + selectedStation.ebike + selectedStation.numDocksAvailable,
        };
      });
  }

  goToFeedback(): void {
    this.router.navigate(['feedback'], { relativeTo: this.activatedRoute });
  }

  openDialog() {
    const bottomSheetRef = this.bottomSheet.open(ItineraryTypeChoiceListComponent);

    const sub = bottomSheetRef.instance.typeChanged.subscribe((type: ItineraryType) => {
      this.goToThisStation(type);
    });

    bottomSheetRef.afterDismissed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  goToThisStation(itineraryType: ItineraryType): void {
    this.router.navigate(['itinerary', itineraryType, +this.activatedRoute.snapshot.paramMap.get('stationId')]);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
