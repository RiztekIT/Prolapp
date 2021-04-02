import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialMensajesComponent } from './historial-mensajes.component';

describe('HistorialMensajesComponent', () => {
  let component: HistorialMensajesComponent;
  let fixture: ComponentFixture<HistorialMensajesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorialMensajesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialMensajesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
