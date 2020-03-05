import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartureListComponent } from './departure-list.component';

describe('DepartureListComponent', () => {
  let component: DepartureListComponent;
  let fixture: ComponentFixture<DepartureListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartureListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
