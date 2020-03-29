import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ChartType } from 'ng-chartist';
import { IPieChartOptions, IChartistData } from 'chartist';

@Component({
  selector: 'app-score-doughnut-chart',
  templateUrl: './score-doughnut-chart.component.html',
  styleUrls: ['./score-doughnut-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  isScoreDisplayed = false;

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {
    setTimeout(() => {
      this.chartData = {
        labels: ['score', 'empty'],
        series: [[this.score], [100 - this.score]],
      };
      this.ref.markForCheck();
      this.isScoreDisplayed = true;
    }, 1000);
    // Never under 500 sadly ^
  }
}
