import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { selectingStation, unselectStationMap, setMapCenter } from '../actions/stations-map';
import { Station, Coordinate } from '../interfaces';
import { AppState } from '../reducers';
import { getCurrentPosition } from '../reducers/galileo';
import { getIsSelectingStation, getSelectedStation } from '../reducers/stations-map';
import { ChartType } from 'ng-chartist';
import { IChartistData, IPieChartOptions } from 'chartist';
import { getDestination, getTravelMode } from '../reducers/stations-list';

@Component({
  selector: 'app-station-description',
  templateUrl: './station-description.component.html',
  styleUrls: ['./station-description.component.scss'],
})
export class StationDescriptionComponent implements OnInit, OnDestroy {
  currentPosition$: Observable<{ lat: number; lng: number }>;
  selectedStation$: Observable<Station>;
  isSelectingStation$: Observable<boolean>;
  destination$: Observable<Station>;
  travelMode$: Observable<string>;

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
  };

  private destroy$: Subject <boolean> = new Subject<boolean>();

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.selectedStation$ = store.pipe(select(getSelectedStation));
    this.currentPosition$ = store.pipe(select(getCurrentPosition));
    this.isSelectingStation$ = store.pipe(select(getIsSelectingStation));
    this.destination$ = store.pipe(select(getDestination));
    this.travelMode$ = store.pipe(select(getTravelMode));
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
      this.selectStationFct(+this.activatedRoute.snapshot.paramMap.get('stationId'));
    });

    this.currentPosition$.pipe(filter(Boolean), take(1))
      .subscribe((position) => {
        this.selectStationFct(+this.activatedRoute.snapshot.paramMap.get('stationId'));
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

  onBack(): void {
    let destination: Station;
    let travelMode: string;
    combineLatest([
      this.destination$,
      this.travelMode$,
    ]).pipe(take(1)).subscribe(([dest, mode]) => {
      destination = dest;
      travelMode = mode;
    });

    if (destination && travelMode) {
      this.router.navigate([travelMode, destination.stationId]);
    } else {
      this.router.navigate(['/']);
    }
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
