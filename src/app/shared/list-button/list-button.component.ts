import { Component, EventEmitter, Output } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Observable } from 'rxjs';
import { HoursSelectorComponent } from 'src/app/dialogs/hours-selector/hours-selector.dialog';

@Component({
  selector: 'app-list-button',
  templateUrl: './list-button.component.html',
  styleUrls: ['./list-button.component.scss']
})
export class ListButtonComponent {
  @Output() refresh = new EventEmitter<void>();
  @Output() selectedDateTime = new EventEmitter<number>();
  isMobile$: Observable<boolean>;

  constructor(
    private bottomSheet: MatBottomSheet,
  ) {
  }

  listRefresh(): void {
    this.refresh.emit();
  }

  openDialog() {
    const bottomSheetRef = this.bottomSheet.open(HoursSelectorComponent);

    const sub = bottomSheetRef.instance.deltaChanged.subscribe((hours: number) => {
      this.selectedDateTime.emit(hours);
    });

    bottomSheetRef.afterDismissed().subscribe(() => {
      sub.unsubscribe();
    });
  }
}
