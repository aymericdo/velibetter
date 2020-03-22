import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationScoreChartComponent } from './station-score-chart.component';

describe('StationScoreChartComponent', () => {
  let component: StationScoreChartComponent;
  let fixture: ComponentFixture<StationScoreChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationScoreChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationScoreChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
