import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoComprasComprasComponent } from './formato-compras-compras.component';

describe('FormatoComprasComprasComponent', () => {
  let component: FormatoComprasComprasComponent;
  let fixture: ComponentFixture<FormatoComprasComprasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoComprasComprasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoComprasComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
