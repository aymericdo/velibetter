import { Component, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TimePickerComponent } from '../shared/time-picker/time-picker.component';

@Component({
  selector: 'app-button-bar',
  templateUrl: './button-bar.component.html',
  styleUrls: ['./button-bar.component.scss']
})
export class ButtonBarComponent implements OnInit {
  @Input() isDisplayingListPages: boolean;
  @Output() selectedTime: Date;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  listRefresh(): void {}

  openDialog() {
    const dialogRef = this.dialog.open(TimePickerComponent);

    const sub = dialogRef.componentInstance.timeChanged.subscribe((time: string) => {
      const hours = +time.split(':')[0];
      const minutes = +time.split(':')[1];
      this.selectedTime.setHours(hours);
      this.selectedTime.setMinutes(minutes);
    });
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }
}
