import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-station-feedback',
  templateUrl: './station-feedback.component.html',
  styleUrls: ['./station-feedback.component.scss']
})
export class StationFeedbackComponent implements OnInit {
  numbers: number[];
  constructor() { }

  ngOnInit() {
    this.numbers = Array(10).fill(0).map((x,i)=>i);
  }

}
