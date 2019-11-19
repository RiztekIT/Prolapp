import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioVentasComponent } from './calendario-ventas.component';

describe('CalendarioVentasComponent', () => {
  let component: CalendarioVentasComponent;
  let fixture: ComponentFixture<CalendarioVentasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarioVentasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarioVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
