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

  private baseArray: [number, string][] = this.addRealHour(Array.from(Array(100).keys()).slice(1));

  hours: [number, string][] = [...this.baseArray];

  constructor(private bottomSheetRef: MatBottomSheetRef<HoursSelectorComponent>) { }

  addNextBatch(): void {
    const lastHour: number = this.hours[this.hours.length - 1][0];
    this.baseArray.forEach(([h,]) => {
      this.hours.push([lastHour + h, this.getRealHour(lastHour + h)]);
    });
  }

  handleClick(hours: number): void {
    this.deltaChanged.emit(hours);
    this.bottomSheetRef.dismiss();
  }

  getRealHour(delta: number): string {
    return moment().isSame(moment().add(delta, 'hour'), 'day') ?
        moment().add(delta + 1, 'hour').format('HH:00')
      :
        moment().add(delta + 1, 'hour').format('DD/MM HH:00');
  }

  private addRealHour(hours: number[]): [number, string][] {
    return hours.map(h => [h, this.getRealHour(h)]);
  }
}
