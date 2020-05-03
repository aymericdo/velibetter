import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FlatPickrOutputOptions } from 'angularx-flatpickr/flatpickr.directive';
import flatpickr from 'flatpickr';
import { French } from 'flatpickr/dist/l10n/fr.js';
import * as moment from 'moment';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.dialog.html',
  styleUrls: ['./time-picker.dialog.scss']
})
export class TimePickerComponent implements OnInit {
  @Output() datetimeChanged = new EventEmitter<moment.Moment>();
  datetime: Date;
  minDate = new Date();

  constructor(
    private dialogRef: MatDialogRef<TimePickerComponent>,
  ) { }

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
