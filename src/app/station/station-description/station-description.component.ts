import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { IChartistData, IPieChartOptions } from 'chartist';
import ChartistTooltip from 'chartist-plugin-tooltips-updated';
import { ChartType } from 'ng-chartist';
import { Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { ItineraryApp, ItineraryAppListComponent } from 'src/app/dialogs/itinerary-app-list/itinerary-app-list.dialog';
import { ItineraryTypeListComponent } from 'src/app/dialogs/itinerary-type-list/itinerary-type-list.dialog';
import { Coordinate, Station } from 'src/app/interfaces';
import { AppState } from 'src/app/reducers';
import { getCurrentPosition, getIsNoGeolocation } from 'src/app/reducers/galileo';
import { ItineraryType } from 'src/app/reducers/stations-list';
import { getIsSelectingStation, getSelectedStation } from 'src/app/reducers/stations-map';

@Component({
  selector: 'app-station-description',
  templateUrl: './station-description.component.html',
  styleUrls: ['./station-description.component.scss'],
})
export class StationDescriptionComponent implements OnInit, OnDestroy {
  selectedStation$: Observable<Station>;
  currentPosition$: Observable<Coordinate>;
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
    this.currentPosition$ = store.pipe(select(getCurrentPosition));
    this.selectedStation$ = store.pipe(select(getSelectedStation));
    this.isSelectingStation$ = store.pipe(select(getIsSelectingStation));
    this.isNoGeolocation$ = store.pipe(select(getIsNoGeolocation));
  }

  ngOnInit(): void {
    this.selectedStation$
      .pipe(filter(Boolean), takeUntil(this.destroy$))
      .subscribe((selectedStation: Station) => {
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
    const bottomSheetRef = this.bottomSheet.open(ItineraryTypeListComponent);

    const sub = bottomSheetRef.instance.typeChanged.subscribe((type: ItineraryType) => {
      const bottomSheetRefBis = this.bottomSheet.open(ItineraryAppListComponent);

      const subBis = bottomSheetRefBis.instance.typeChanged.subscribe((app: ItineraryApp) => {
        let position: Coordinate;
        this.currentPosition$.pipe(take(1)).subscribe((cp) => {
          position = cp;
        });

        let station: Station;
        this.selectedStation$.pipe(take(1)).subscribe((s) => {
          station = s;
        });

        switch (app) {
          case 'inApp': {
            this.goToThisStation(type);
            break;
          }

          case 'maps': {
            window.open(
              `https://www.google.fr/maps/dir/?saddr=${position.lat},${position.lng}&daddr=${station.lat},${station.lng}`
              + `&dirflg=${type === 'departure' ? 'w' : 'b'}`,
              '_blank',
            );
            break;
          }

          case 'plans': {
            window.open(
              `http://maps.apple.com/?saddr=${position.lat},${position.lng}&daddr=${station.lat},${station.lng}&dirflg=w`,
              '_blank',
            );
            break;
          }
        }
      });

      bottomSheetRefBis.afterDismissed().subscribe(() => {
        subBis.unsubscribe();
      });
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
