import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalidaProductoComponent } from './salida-producto.component';

describe('SalidaProductoComponent', () => {
  let component: SalidaProductoComponent;
  let fixture: ComponentFixture<SalidaProductoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalidaProductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalidaProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
