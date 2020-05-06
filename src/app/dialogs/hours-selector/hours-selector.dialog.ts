import { Component, EventEmitter, Output } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import * as moment from 'moment';

@Component({
  selector: 'app-hours-selector',
  templateUrl: './hours-selector.dialog.html',
  styleUrls: ['./hours-selector.dialog.scss']
})
export class HoursSelectorComponent {
  @Output() deltaChanged: EventEmitter<number> = new EventEmitter<number>();
  hoverHour = null;

  private baseArray = Array.from(Array(100).keys()).slice(1);
  private scrollDelta = 0;
  private precedentScrollDelta = 0;
  private precedentScrollTop = 0;

  hours: number[] = [...this.baseArray];

  constructor(private bottomSheetRef: MatBottomSheetRef<HoursSelectorComponent>) { }

  addNextBatch(): void {
    const lastHour = this.hours[this.hours.length - 1];
    this.baseArray.forEach((h) => {
      this.hours.push(lastHour + h);
    });
  }

  handleClick(hours: number): void {
    this.deltaChanged.emit(hours);
    this.bottomSheetRef.dismiss();
  }

  onScroll(event: UIEvent): void {
    const vibrate = 15;
    if ((event.target as HTMLElement).scrollTop > this.precedentScrollTop) {
      this.scrollDelta += ((event.target as HTMLElement).scrollTop % 49 - this.precedentScrollTop % 49);

      if (this.precedentScrollDelta > this.scrollDelta) {
        window.navigator.vibrate(vibrate);
      }
    } else {
      this.scrollDelta -= (this.precedentScrollTop % 49 - (event.target as HTMLElement).scrollTop % 49);

      if (this.precedentScrollDelta < this.scrollDelta) {
        window.navigator.vibrate(vibrate);
      }
    }

    this.precedentScrollDelta = this.scrollDelta;
    this.precedentScrollTop = (event.target as HTMLElement).scrollTop;
  }

  getRealHour(delta: number): string {
    return moment().isSame(moment().add(delta, 'hour'), 'day') ?
        moment().add(delta + 1, 'hour').format('HH:00')
      :
        moment().add(delta + 1, 'hour').format('DD/MM HH:00');
  }
}
