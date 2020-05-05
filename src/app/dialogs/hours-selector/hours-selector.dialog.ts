import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-hours-selector',
  templateUrl: './hours-selector.dialog.html',
  styleUrls: ['./hours-selector.dialog.scss']
})
export class HoursSelectorComponent {
  @Output() deltaChanged: EventEmitter<number> = new EventEmitter<number>();

  private baseArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  private scrollDelta = 0;
  private precedentScrollDelta = 0;
  private precedentScrollTop = 0;

  hours: number[] = [...this.baseArray];

  constructor() { }

  addNextBatch(): void {
    const lastHour = this.hours[this.hours.length - 1];
    this.baseArray.forEach((h) => {
      this.hours.push(lastHour + h);
    });
  }

  handleClick(hours: number): void {
    console.log(hours);
  }

  onScroll(event: UIEvent): void {
    if ((event.target as HTMLElement).scrollTop > this.precedentScrollTop) {
      this.scrollDelta += ((event.target as HTMLElement).scrollTop % 49 - this.precedentScrollTop % 49);

      if (this.precedentScrollDelta > this.scrollDelta) {
        window.navigator.vibrate(100);
      }
    } else {
      this.scrollDelta -= (this.precedentScrollTop % 49 - (event.target as HTMLElement).scrollTop % 49);

      if (this.precedentScrollDelta < this.scrollDelta) {
        window.navigator.vibrate(100);
      }
    }

    this.precedentScrollDelta = this.scrollDelta;
    this.precedentScrollTop = (event.target as HTMLElement).scrollTop;
  }
}
