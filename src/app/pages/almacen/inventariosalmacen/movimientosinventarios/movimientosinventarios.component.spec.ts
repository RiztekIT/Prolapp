import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientosinventariosComponent } from './movimientosinventarios.component';

describe('MovimientosinventariosComponent', () => {
  let component: MovimientosinventariosComponent;
  let fixture: ComponentFixture<MovimientosinventariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovimientosinventariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovimientosinventariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
