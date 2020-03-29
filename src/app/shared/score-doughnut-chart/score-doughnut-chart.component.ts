import { Component, OnInit, Input } from '@angular/core';
import { ChartType } from 'ng-chartist';
import { IPieChartOptions, IChartistData } from 'chartist';

@Component({
  selector: 'app-score-doughnut-chart',
  templateUrl: './score-doughnut-chart.component.html',
  styleUrls: ['./score-doughnut-chart.component.scss'],
})
export class ScoreDoughnutChartComponent implements OnInit {
  @Input() score: number;

  chartType: ChartType = 'Pie';
  chartOptions: IPieChartOptions = {
    donut: true,
    donutWidth: 5,
    showLabel: false,
    total: 100,
  };
  chartData: IChartistData;

  constructor() {}

  ngOnInit() {
    if (this.score > 0) {
      this.chartData = {
        labels: ['score', 'empty'],
        series: [[this.score], [100 - this.score]],
      };
    } else {
      this.chartData = {
        labels: ['empty'],
        series: [[100]],
      };
    }
  }
}
