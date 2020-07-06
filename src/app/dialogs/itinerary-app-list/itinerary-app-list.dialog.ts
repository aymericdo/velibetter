import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

export type ItineraryApp = 'maps' | 'plans' | 'inApp';

@Component({
  selector: 'app-itinerary-app-list',
  templateUrl: './itinerary-app-list.dialog.html',
  styleUrls: ['./itinerary-app-list.dialog.scss']
})
export class ItineraryAppListComponent implements OnInit {
  @Output() typeChanged = new EventEmitter<ItineraryApp>();

  types = [
    { code: 'inApp', label: 'Vue rapide' },
    { code: 'maps', label: 'Google Maps' },
    { code: 'plans', label: 'Plans' },
  ];

  constructor(
    private bottomSheetRef: MatBottomSheetRef<ItineraryAppListComponent>,
  ) { }

  ngOnInit() {
  }

  handleClick(type: ItineraryApp) {
    this.typeChanged.emit(type);
    this.bottomSheetRef.dismiss();
  }
}
