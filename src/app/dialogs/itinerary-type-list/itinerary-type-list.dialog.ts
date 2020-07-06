import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ItineraryType } from '../../reducers/stations-list';

@Component({
  selector: 'app-itinerary-type-list',
  templateUrl: './itinerary-type-list.dialog.html',
  styleUrls: ['./itinerary-type-list.dialog.scss']
})
export class ItineraryTypeListComponent implements OnInit {
  @Output() typeChanged = new EventEmitter<ItineraryType>();

  types = [{ code: 'departure', label: 'Départ' }, { code: 'arrival', label: 'Arrivée' }];

  constructor(
    private bottomSheetRef: MatBottomSheetRef<ItineraryTypeListComponent>,
  ) { }

  ngOnInit() {
  }

  handleClick(type: ItineraryType) {
    this.typeChanged.emit(type);
    this.bottomSheetRef.dismiss();
  }
}
