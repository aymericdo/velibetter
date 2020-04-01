import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RowStationComponent } from './row-station.component';

describe('RowStationComponent', () => {
  let component: RowStationComponent;
  let fixture: ComponentFixture<RowStationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RowStationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RowStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
