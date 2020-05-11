import { Injectable } from '@angular/core';

declare const gtag: (
  event: string,
  eventName: string,
  options: {
    eventCategory: string,
    eventLabel: string,
    eventAction: string,
    eventValue: number,
  },
) => void;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {
  eventEmitter(
    eventName: string,
    eventCategory: string,
    eventAction: string,
    eventLabel: string = null,
    eventValue: number = null,
  ) {
    gtag('event', eventName, {
      eventCategory,
      eventLabel,
      eventAction,
      eventValue
    });
  }
}
