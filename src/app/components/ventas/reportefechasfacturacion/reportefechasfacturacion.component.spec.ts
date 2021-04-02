import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportefechasfacturacionComponent } from './reportefechasfacturacion.component';

describe('ReportefechasfacturacionComponent', () => {
  let component: ReportefechasfacturacionComponent;
  let fixture: ComponentFixture<ReportefechasfacturacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportefechasfacturacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportefechasfacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
