import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapButtonComponent } from './map-button.component';

describe('MapButtonComponent', () => {
  let component: MapButtonComponent;
  let fixture: ComponentFixture<MapButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
