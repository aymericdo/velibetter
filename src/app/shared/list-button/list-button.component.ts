import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';
import { getIsMobile } from 'src/app/reducers/screen';
import { TimePickerComponent } from '../../dialogs/time-picker/time-picker.dialog';


@Component({
  selector: 'app-list-button',
  templateUrl: './list-button.component.html',
  styleUrls: ['./list-button.component.scss']
})
export class ListButtonComponent {
  @Output() refresh = new EventEmitter<any>();
  @Output() selectedDateTime = new EventEmitter<moment.Moment>();
  isMobile$: Observable<boolean>;

  constructor(
    private dialog: MatDialog,
    private store: Store<AppState>,
  ) {
    this.isMobile$ = store.pipe(select(getIsMobile));
  }

  listRefresh(): void {
    this.refresh.emit();
  }

  openDialog() {
    let isMobile: boolean;
    this.isMobile$.pipe(take(1)).subscribe((mobile) => isMobile = mobile);
    let config = new MatDialogConfig();
    config = {
      maxWidth: isMobile ? '100vw' : 'inherit',
    };
    const dialogRef = this.dialog.open(TimePickerComponent, config);

    const sub = dialogRef.componentInstance.datetimeChanged.subscribe((dt: moment.Moment) => {
      this.selectedDateTime.emit(dt);
    });

    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }
}
