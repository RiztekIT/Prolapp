import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportefacturacionResumenComponent } from './reportefacturacion-resumen.component';

describe('ReportefacturacionResumenComponent', () => {
  let component: ReportefacturacionResumenComponent;
  let fixture: ComponentFixture<ReportefacturacionResumenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportefacturacionResumenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportefacturacionResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
