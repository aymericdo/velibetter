import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TimePickerComponent } from '../time-picker/time-picker.component';

@Component({
  selector: 'app-list-button',
  templateUrl: './list-button.component.html',
  styleUrls: ['./list-button.component.scss']
})
export class ListButtonComponent {
  @Output() refresh = new EventEmitter<any>();
  @Output() selectedTime = new EventEmitter<Date>();

  modalTime = new Date();

  constructor(private dialog: MatDialog) {}

  listRefresh(): void {
    this.refresh.emit();
  }

  openDialog() {
    const dialogRef = this.dialog.open(TimePickerComponent);

    const sub = dialogRef.componentInstance.timeChanged.subscribe((time: string) => {
      const hours = +time.split(':')[0];
      const minutes = +time.split(':')[1];
      this.modalTime.setHours(hours);
      this.modalTime.setMinutes(minutes);
      this.selectedTime.emit(this.modalTime);
    });
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }
}
