import { Component, Input } from '@angular/core';
import { IBarChartOptions, IChartistData } from 'chartist';
import { ChartEvent, ChartType } from 'ng-chartist';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss']
})
export class DoughnutChartComponent {
  @Input() type: ChartType;
  @Input() data: IChartistData;
  @Input() options: IBarChartOptions;
  @Input() events: ChartEvent;
}
