import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreDoughnutChartComponent } from './score-doughnut-chart.component';

describe('ScoreDoughnutChartComponent', () => {
  let component: ScoreDoughnutChartComponent;
  let fixture: ComponentFixture<ScoreDoughnutChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoreDoughnutChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreDoughnutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
