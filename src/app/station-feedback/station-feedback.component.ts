import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { savingFeedback } from '../actions/feedback';
import { Feedback, FeedbackType } from '../interfaces/index';
import { AppState } from '../reducers';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-station-feedback',
  templateUrl: './station-feedback.component.html',
  styleUrls: ['./station-feedback.component.scss']
})
export class StationFeedbackComponent implements OnInit {
  feedback$: Observable<Feedback>;
  numbers: string[];
  selectedCard: string;
  numberMechanical: string;
  numberEbike: string;
  numberDock: string;
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    ) {
  }

  ngOnInit() {
    this.numbers = Array(10).fill(0).map((x, i) => i.toString());
    this.numbers.push('+');
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
    this.selectedCard = '';
    this.numberMechanical = '';
    this.numberEbike = '';
    this.numberDock = '';
  }

  clickSubmit() {
    const feedback = {
      stationId: +this.activatedRoute.snapshot.paramMap.get('stationId'),
      type: this.selectedCard === 'confirmed' ? FeedbackType.confirmed : FeedbackType.broken,
      mechanical: this.numberMechanical,
      ebike: this.numberEbike,
      dock: this.numberDock,
    };
    this.clear();
    this.store.dispatch(savingFeedback({ feedback }));
  }

}
