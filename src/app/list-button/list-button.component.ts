import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TimePickerComponent } from '../shared/time-picker/time-picker.component';
import * as moment from 'moment';


@Component({
  selector: 'app-list-button',
  templateUrl: './list-button.component.html',
  styleUrls: ['./list-button.component.scss']
})
export class ListButtonComponent implements OnInit {
  @Output() refresh = new EventEmitter<any>();
  @Output() selectedDateTime = new EventEmitter<moment.Moment>();

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  listRefresh(): void {
    this.refresh.emit();
  }

  openDialog() {
    const dialogRef = this.dialog.open(TimePickerComponent);

    const sub = dialogRef.componentInstance.datetimeChanged.subscribe((dt: moment.Moment) => {
      this.selectedDateTime.emit(dt);
    });
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }
}
