import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';

export const animationSpeed = '500ms';
export const animationType = 'ease-out';

const feedbackTransitions = [
  transition('Description => Feedback', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      }),
    ]),
    query(':leave', animateChild()),
    group([
      query(':leave', [
        style({ transform: 'translateX(0%)' }),
        animate(`${animationSpeed} ${animationType}`, style({ transform: 'translateX(-100%)' }))
      ]),
      query(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate(`${animationSpeed} ${animationType}`, style({ transform: 'translateX(0%)' }))
      ])
    ]),
    query(':enter', animateChild()),
  ]),
  transition('Feedback => Description', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      })
    ]),
    query(':leave', animateChild()),
    group([
      query(':leave', [
        style({ transform: 'translateX(0%)' }),
        animate(`${animationSpeed} ${animationType}`, style({ transform: 'translateX(100%)' }))
      ]),
      query(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate(`${animationSpeed} ${animationType}`, style({ transform: 'translateX(0%)' }))
      ])
    ]),
    query(':enter', animateChild()),
  ]),
];

export const routerTransition = [
  trigger('routeAnimationsDesktop', [
    transition('Description => void, Itinerary => void, Itinerary => ItineraryMap, Description => ItineraryMap, About => *', [
      style({ position: 'relative' }),
      query(':leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          style({ opacity: 1 }),
          animate(`${animationSpeed} ${animationType}`, style({ opacity: 0 }))
        ]),
      ]),
    ]),
    ...feedbackTransitions,
  ]),
  trigger('routeAnimationsMobile', [
    transition('void => Description, void => Itinerary, ItineraryMap => Itinerary, * => About', [
      style({ position: 'relative' }),
      query(':enter', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ]),
      query(':enter', animateChild()),
      group([
        query(':enter', [
          style({ transform: 'translateX(100%)' }),
          animate(`${animationSpeed} ${animationType}`, style({ transform: 'translateX(0%)' })),
        ]),
      ]),
    ]),
    transition('Description => void, Itinerary => void, Itinerary => ItineraryMap, Description => ItineraryMap, About => *', [
      style({ position: 'relative' }),
      query(':leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          style({ transform: 'translateX(0%)' }),
          animate(`${animationSpeed} ${animationType}`, style({ transform: 'translateX(100%)' }))
        ]),
      ]),
    ]),
    ...feedbackTransitions,
  ])
];
