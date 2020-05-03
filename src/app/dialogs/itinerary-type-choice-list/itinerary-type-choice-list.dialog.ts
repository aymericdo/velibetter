import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ItineraryType } from '../../reducers/stations-list';

@Component({
  selector: 'app-itinerary-type-choice-list',
  templateUrl: './itinerary-type-choice-list.dialog.html',
  styleUrls: ['./itinerary-type-choice-list.dialog.scss']
})
export class ItineraryTypeChoiceListComponent implements OnInit {
  @Output() typeChanged = new EventEmitter<ItineraryType>();

  types = [{ code: 'departure', label: 'Départ' }, { code: 'arrival', label: 'Arrivée' }];

  constructor(
    private dialogRef: MatDialogRef<ItineraryTypeChoiceListComponent>,
  ) { }

  ngOnInit() {
  }

  handleClick(type: ItineraryType) {
    this.typeChanged.emit(type);
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }
}
