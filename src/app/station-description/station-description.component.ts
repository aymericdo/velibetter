import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { IChartistData, IPieChartOptions } from 'chartist';
import ChartistTooltip from 'chartist-plugin-tooltips-updated';
import { ChartType } from 'ng-chartist';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { selectingStation, setMapCenter, unselectStationMap } from '../actions/stations-map';
import { pageSliderAnimations } from '../animations/page-slider.animations';
import { Coordinate, Station } from '../interfaces';
import { AppState } from '../reducers';
import { getCurrentPosition } from '../reducers/galileo';
import { getDestination, getItineraryType } from '../reducers/stations-list';
import { getIsSelectingStation, getSelectedStation } from '../reducers/stations-map';

@Component({
  selector: 'app-station-description',
  templateUrl: './station-description.component.html',
  styleUrls: ['./station-description.component.scss'],
  animations: [pageSliderAnimations]
})
export class StationDescriptionComponent implements OnInit, OnDestroy {
  currentPosition$: Observable<{ lat: number; lng: number }>;
  selectedStation$: Observable<Station>;
  isSelectingStation$: Observable<boolean>;
  destination$: Observable<Station>;
  itineraryType$: Observable<string>;

  isFeedbackOpen = false;
  isLoading = true;

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
    this.currentPosition$ = store.pipe(select(getCurrentPosition));
    this.isSelectingStation$ = store.pipe(select(getIsSelectingStation));
    this.destination$ = store.pipe(select(getDestination));
    this.itineraryType$ = store.pipe(select(getItineraryType));
  }

  ngOnInit(): void {
    combineLatest([
      this.currentPosition$.pipe(filter(Boolean), take(1)),
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
      ),
    ]).pipe(
      map(([position, val]) => val),
      takeUntil(this.destroy$),
    ).subscribe((val: NavigationEnd) => {
      this.isFeedbackOpen = this.activatedRoute.children.length === 1;
      this.selectStationFct(+this.activatedRoute.snapshot.paramMap.get('stationId'));
    });

    this.currentPosition$.pipe(filter(Boolean), take(1))
      .subscribe((position) => {
        this.isFeedbackOpen = this.activatedRoute.children.length === 1;
        this.selectStationFct(+this.activatedRoute.snapshot.paramMap.get('stationId'));
        this.isLoading = false;
      });

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

  selectStationFct(stationId: number): void {
    this.store.dispatch(selectingStation({ stationId }));
  }

  goToFeedback(): void {
    this.router.navigate(['feedback'], { relativeTo: this.activatedRoute });
  }

  goToThisStation(): void {
    this.router.navigate(['itinerary', 'departure', +this.activatedRoute.snapshot.paramMap.get('stationId')]);
  }

  ngOnDestroy() {
    let position: Coordinate;
    this.currentPosition$.pipe(take(1)).subscribe((cp) => { position = cp; });
    this.store.dispatch(setMapCenter(position));
    this.store.dispatch(unselectStationMap());

    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
