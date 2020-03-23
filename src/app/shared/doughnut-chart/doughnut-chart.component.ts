import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss']
})
export class DoughnutChartComponent implements OnInit {
  @Input() showLegend: boolean;
  @Input() showLabels: boolean;
  @Input() data: any[];
  @Input() width: number;
  @Input() height: number;

  // options
  gradient = false;
  isDoughnut: boolean = true;
  legendPosition: string = 'below';
  colorScheme = "picnic";
  view: number[];

  ngOnInit() {
    this.view = [this.width, this.height];
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
