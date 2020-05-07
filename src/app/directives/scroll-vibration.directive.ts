import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appScrollVibration]'
})
export class ScrollVibrationDirective {
  @Input() lineSize: number;

  private scrollDelta = 0;
  private precedentScrollDelta = 0;
  private precedentScrollTop = 0;

  constructor() {
  }

  @HostListener('scroll', ['$event']) onScroll(event: UIEvent): void {
    const vibrate = 15;
    if ((event.target as HTMLElement).scrollTop > this.precedentScrollTop) {
      this.scrollDelta += ((event.target as HTMLElement).scrollTop % (this.lineSize + 1) - this.precedentScrollTop % (this.lineSize + 1));

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
}
