import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-station-feedback',
  templateUrl: './station-feedback.component.html',
  styleUrls: ['./station-feedback.component.scss']
})
export class StationFeedbackComponent implements OnInit {
  numbers: string[];
  selectedCard: string;
  numberMechanical: string;
  numberEbike: string;
  numberDock: string;
  constructor() { }

  ngOnInit() {
    this.numbers = Array(10).fill(0).map((x,i)=>i.toString());
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
    const submission = {
      type: this.selectedCard,
      mechanical: this.numberMechanical,
      ebike: this.numberEbike,
      dock: this.numberDock,
    };
    this.clear();
  }

}
