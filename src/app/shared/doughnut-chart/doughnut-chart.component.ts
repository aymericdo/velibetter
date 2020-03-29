import { Component, Input, OnInit } from '@angular/core';
import { IBarChartOptions, IChartistData, IChartistEasingDefinition, IChartistAnimations } from 'chartist';
import { ChartEvent, ChartType } from 'ng-chartist';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss']
})
export class DoughnutChartComponent implements OnInit {
  @Input() type: ChartType;
  @Input() data: IChartistData;
  @Input() options: IBarChartOptions;
  @Input() events: ChartEvent;

  ngOnInit() {
    this.events = {
      ...this.events,
      draw: (data): void => {
        if (data.type === 'slice') {
          // Get the total path length in order to use for dash array animation
          const pathLength = data.element._node.getTotalLength();

          // Set a dasharray that matches the path length as prerequisite to animate dashoffset
          data.element.attr({
            'stroke-dasharray': pathLength + 'px ' + pathLength + 'px',
          });

          let easing: IChartistEasingDefinition = null;
          if (data.index === 0) {
            easing =  [1, 0.75, 0.5, 0.5];
          } else if (data.index === this.data.labels.length - 1) {
            easing = [0.5, 0.5, 0.75, 1];
          } else {
            easing = [0.5, 0.5, 0.5, 0.5];
          }

          // Create animation definition while also assigning an ID to the animation for later sync usage
          const animationDefinition: IChartistAnimations = {
            'stroke-dashoffset': {
              id: 'anim' + data.index,
              dur: 1000 * data.value[0] / data.totalDataSum,
              from: -pathLength + 'px',
              to: '0px',
              easing,
              // We need to use `fill: 'freeze'` otherwise our animation will fall back to initial (not visible)
              fill: 'freeze',
            },
          };

          // If this was not the first slice, we need to time the animation so that it uses the end sync event of the previous animation
          if (data.index !== 0) {
            animationDefinition['stroke-dashoffset'].begin = 'anim' + (data.index - 1) + '.end';
          }

          // We need to set an initial value before the animation starts as we are not in guided mode which would do that for us
          data.element.attr({
            'stroke-dashoffset': -pathLength + 'px'
          });

          // We can't use guided mode as the animations need to rely on setting begin manually
          // See http://gionkunz.github.io/chartist-js/api-documentation.html#chartistsvg-function-animate
          data.element.animate(animationDefinition, false);
        }
      }
    };
  }
}
