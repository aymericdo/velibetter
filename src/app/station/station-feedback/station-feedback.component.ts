import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { getIsSelectingStation, getSelectedStation } from 'src/app/reducers/stations-map';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
import { savingFeedback } from '../../actions/feedback';
import { Feedback, FeedbackType, Station } from '../../interfaces/index';
import { AppState } from '../../reducers';

@Component({
  selector: 'app-station-feedback',
  templateUrl: './station-feedback.component.html',
  styleUrls: ['./station-feedback.component.scss'],
})
export class StationFeedbackComponent {
  feedback$: Observable<Feedback>;
  isSelectingStation$: Observable<boolean>;
  selectedStation$: Observable<Station>;

  selectedCard: string;
  numberMechanical: string;
  numberEbike: string;
  numberDock: string;
  hasFeedback: boolean;

  numbers: string[] = Array(10).fill(0).map((x, i) => i.toString()).concat(['+']);

  constructor(
    private store: Store<AppState>,
    private snackBar: MatSnackBar,
    private googleAnalyticsService: GoogleAnalyticsService,
  ) {
    this.isSelectingStation$ = store.pipe(select(getIsSelectingStation));
    this.selectedStation$ = store.pipe(select(getSelectedStation));
  }

  clickCard(type: string) {
    this.selectedCard = type;
    this.setFeedback();
  }

  clickMechanical(picked: number) {
    this.numberMechanical = picked.toString();
    this.setFeedback();
  }

  clickEbike(picked: number) {
    this.numberEbike = picked.toString();
    this.setFeedback();
  }

  clickDock(picked: number) {
    this.numberDock = picked.toString();
    this.setFeedback();
  }

  clear() {
    this.selectedCard = null;
    this.numberMechanical = null;
    this.numberEbike = null;
    this.numberDock = null;
    this.setFeedback();
    this
      .googleAnalyticsService
      .eventEmitter('clear_feedback', 'feedback', 'cancel', 'click', 1);
  }

  setFeedback(): void {
    this.hasFeedback = !!this.selectedCard ||
      !!this.numberMechanical ||
      !!this.numberEbike ||
      !!this.numberDock;
  }

  clickSubmit() {
    this
      .googleAnalyticsService
      .eventEmitter('give_feedback', 'feedback', 'submit', 'click', 1);

    let feedback = null;
    this.selectedStation$.pipe(take(1)).subscribe((station: Station) => {
      feedback = {
        stationId: +station.stationId,
        type: this.selectedCard === 'confirmed' ? FeedbackType.confirmed : FeedbackType.broken,
        mechanical: this.numberMechanical ? +this.numberMechanical : station.mechanical,
        ebike: this.numberEbike ? +this.numberEbike : station.ebike,
        dock: this.numberDock ? +this.numberDock : station.numDocksAvailable,
      };
    });
    this.store.dispatch(savingFeedback({ feedback }));
    this.clear();
    this.snackBar.open('Feedback envoyé! Merci beaucoup ☺️', 'Ok', {
      duration: 5000,
    });
  }
}
