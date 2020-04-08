import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationFeedbackComponent } from './station-feedback.component';

describe('StationFeedbackComponent', () => {
  let component: StationFeedbackComponent;
  let fixture: ComponentFixture<StationFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
