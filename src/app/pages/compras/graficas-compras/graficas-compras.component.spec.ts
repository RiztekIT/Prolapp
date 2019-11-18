import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficasComprasComponent } from './graficas-compras.component';

describe('GraficasComprasComponent', () => {
  let component: GraficasComprasComponent;
  let fixture: ComponentFixture<GraficasComprasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraficasComprasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficasComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
