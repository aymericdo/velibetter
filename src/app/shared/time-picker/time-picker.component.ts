import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import flatpickr from "flatpickr"
import { French } from "flatpickr/dist/l10n/fr.js"
import { FlatPickrOutputOptions } from 'angularx-flatpickr/flatpickr.directive';



@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit {
  @Output() datetimeChanged = new EventEmitter<moment.Moment>();
  datetime: Date;
  minDate = new Date();

  constructor(private dialogRef: MatDialogRef<TimePickerComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    flatpickr.localize(French);
  }

  save() {
    this.datetimeChanged.emit(moment(this.datetime));
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

  flatpickrValueUpdate(pickedValue: FlatPickrOutputOptions) {
    this.datetime = pickedValue.selectedDates[0];
  }

}
