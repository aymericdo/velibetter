import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';


@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit {
  @Output() datetimeChanged = new EventEmitter<moment.Moment>();
  datetime = moment();

  minDate = moment(new Date());
  minTime = `${this.minDate.hour()}:${this.minDate.minute()}`;

  constructor(private dialogRef: MatDialogRef<TimePickerComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  save() {
    this.datetimeChanged.emit(this.datetime);
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

  setTime(time: string) {
    const hours = +time.split(':')[0];
    const minutes = +time.split(':')[1];
    const newDate = moment();
    newDate.hour(hours);
    newDate.minute(minutes);
    newDate.diff(this.minDate, 'hour') > 0 ? this.datetime = newDate : this.datetime = newDate.add(24, 'hour');
  }

}
