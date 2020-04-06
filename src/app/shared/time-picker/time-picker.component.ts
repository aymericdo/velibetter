import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit {
  @Output() timeChanged = new EventEmitter<string>();
  time: string;

  constructor(private dialogRef: MatDialogRef<TimePickerComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  save() {
    this.timeChanged.emit(this.time);
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

  setTime(time) {
    this.time = time;
  }

}
