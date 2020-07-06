import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { fetchingClosestStations } from '../actions/stations-list';
import { ItineraryApp, ItineraryAppListComponent } from '../dialogs/itinerary-app-list/itinerary-app-list.dialog';
import { Coordinate, Station } from '../interfaces';
import { AppState } from '../reducers';
import { getCurrentPosition } from '../reducers/galileo';
import { getCurrentDelta, getIsLoading, getStationsStatus } from '../reducers/stations-list';

@Component({
  selector: 'app-departure',
  templateUrl: './departure.component.html',
  styleUrls: ['./departure.component.scss']
})
export class DepartureComponent implements OnInit {
  currentPosition$: Observable<{
    lat: number;
    lng: number;
  }>;
  stationsStatus$: Observable<Station[]>;
  isLoading$: Observable<boolean>;
  currentDelta$: Observable<string>;

  constructor(
    private bottomSheet: MatBottomSheet,
    private store: Store<AppState>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.currentPosition$ = store.pipe(select(getCurrentPosition));
    this.stationsStatus$ = store.pipe(select(getStationsStatus));
    this.isLoading$ = store.pipe(select(getIsLoading));
    this.currentDelta$ = store.pipe(
      select(getCurrentDelta),
      map(delta =>
        delta ?
          moment().isSame(moment().add(delta, 'hour'), 'day') ?
            moment().add(delta + 1, 'hour').format('HH:00')
            :
            moment().add(delta + 1, 'hour').format('DD/MM HH:00')
          :
          null
      ),
    );
  }

  ngOnInit(): void {
    this.currentPosition$
      .pipe(filter(Boolean), take(1))
      .subscribe((position: { lat: number; lng: number }) => {
        this.store.dispatch(
          fetchingClosestStations({
            isDeparture: true
          })
        );
      });
  }

  trackByFn(index: number, station: Station): number {
    return station.stationId;
  }

  handleClick(station: Station): void {
    const bottomSheetRef = this.bottomSheet.open(ItineraryAppListComponent);

    const sub = bottomSheetRef.instance.typeChanged.subscribe((app: ItineraryApp) => {
      let position: Coordinate;
      this.currentPosition$.pipe(take(1)).subscribe((cp) => {
        position = cp;
      });

      switch (app) {
        case 'inApp': {
          this.goToThisStation(station.stationId);
          break;
        }

        case 'maps': {
          window.open(
            `https://www.google.com/maps?saddr=${position.lat},${position.lng}&daddr=${station.lat},${station.lng}`
            + `&dirflg=w`,
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

    bottomSheetRef.afterDismissed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  goToThisStation(stationId: number): void {
    this.router.navigate([stationId], { relativeTo: this.activatedRoute });
  }

  refresh() {
    this.store.dispatch(
      fetchingClosestStations({
        isDeparture: true,
      })
    );
  }

  removeDelta() {
    this.store.dispatch(
      fetchingClosestStations({
        isDeparture: true,
      })
    );
  }

  selectedDateTime(delta: number) {
    this.store.dispatch(
      fetchingClosestStations({
        isDeparture: true,
        delta,
      })
    );
  }
}
