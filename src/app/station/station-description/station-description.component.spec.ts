import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationDescriptionComponent } from './station-description.component';

describe('StationDescriptionComponent', () => {
  let component: StationDescriptionComponent;
  let fixture: ComponentFixture<StationDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
