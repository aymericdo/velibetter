import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getIsSelectingStation } from 'src/app/reducers/stations-map';
import { savingFeedback } from '../../actions/feedback';
import { Feedback, FeedbackType } from '../../interfaces/index';
import { AppState } from '../../reducers';

@Component({
  selector: 'app-station-feedback',
  templateUrl: './station-feedback.component.html',
  styleUrls: ['./station-feedback.component.scss'],
})
export class StationFeedbackComponent implements OnInit {
  feedback$: Observable<Feedback>;
  isSelectingStation$: Observable<boolean>;
  // selectedStation$: Observable<Station>;

  selectedCard: string;
  numberMechanical: string;
  numberEbike: string;
  numberDock: string;

  numbers: string[] = Array(10).fill(0).map((x, i) => i.toString()).concat(['+']);

  constructor(
    private store: Store<AppState>,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
  ) {
    this.isSelectingStation$ = store.pipe(select(getIsSelectingStation));
    // this.selectedStation$ = store.pipe(select(getSelectedStation));
  }

  ngOnInit() {
  }

  clickCard(type: string) {
    this.selectedCard = type;
  }

  clickMechanical(picked: number) {
    this.numberMechanical = picked.toString();
  }

  clickEbike(picked: number) {
    this.numberEbike = picked.toString();
  }

  clickDock(picked: number) {
    this.numberDock = picked.toString();
  }

  clear() {
    this.selectedCard = null;
    this.numberMechanical = null;
    this.numberEbike = null;
    this.numberDock = null;
  }

  hasFeedback(): boolean {
    return !!this.selectedCard ||
      !!this.numberMechanical ||
      !!this.numberEbike ||
      !!this.numberDock;
  }

  clickSubmit() {
    const feedback = {
      stationId: +this.activatedRoute.snapshot.paramMap.get('stationId'),
      type: this.selectedCard === 'confirmed' ? FeedbackType.confirmed : FeedbackType.broken,
      mechanical: this.numberMechanical,
      ebike: this.numberEbike,
      dock: this.numberDock,
    };
    this.store.dispatch(savingFeedback({ feedback }));
    this.clear();
    this.snackBar.open('Feedback envoyé! Merci beaucoup :)', 'Ok', {
      duration: 5000,
    });
  }
}
