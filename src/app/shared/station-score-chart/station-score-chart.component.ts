import { Component } from '@angular/core';


@Component({
  selector: 'app-station-score-chart',
  templateUrl: './station-score-chart.component.html',
  styleUrls: ['./station-score-chart.component.scss']
})
export class StationScoreChartComponent {
  view: any[] = [70, 70];

  // options
  gradient: boolean = true;
  showLegend: boolean = false;
  showLabels: boolean = false;
  isDoughnut: boolean = true;
  legendPosition: string = 'below';
  colorScheme = "picnic";

  single = [
  {
    "name": "Score",
    "value": 89
  },
  {
    "name": "Empty",
    "value": 11
  }
];

  constructor() {
    Object.assign(this, { single: this.single });
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
