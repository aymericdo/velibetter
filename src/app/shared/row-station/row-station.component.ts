import { Component, OnInit, Input } from '@angular/core';
import { Station } from 'src/app/interfaces';

@Component({
  selector: 'app-row-station',
  templateUrl: './row-station.component.html',
  styleUrls: ['./row-station.component.scss']
})
export class RowStationComponent implements OnInit {
  @Input() station: Station;

  constructor() { }

  ngOnInit() {
  }

}
