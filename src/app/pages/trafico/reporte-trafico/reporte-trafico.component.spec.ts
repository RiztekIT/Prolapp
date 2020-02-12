import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteTraficoComponent } from './reporte-trafico.component';

describe('ReporteTraficoComponent', () => {
  let component: ReporteTraficoComponent;
  let fixture: ComponentFixture<ReporteTraficoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteTraficoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteTraficoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
