import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { IChartistData, IPieChartOptions } from 'chartist';
import ChartistTooltip from 'chartist-plugin-tooltips-updated';
import { ChartType } from 'ng-chartist';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { getIsNoGeolocation } from 'src/app/reducers/galileo';
import { setMapCenter } from '../../actions/stations-map';
import { Station } from '../../interfaces';
import { AppState } from '../../reducers';
import { getIsSelectingStation, getSelectedStation } from '../../reducers/stations-map';

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
        appendToBody: true
      })
    ]
  };

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
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
          labels: ['mécanique', 'ebike', 'place vide'],
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

  goToThisStation(): void {
    this.router.navigate(['itinerary', 'departure', +this.activatedRoute.snapshot.paramMap.get('stationId')]);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
