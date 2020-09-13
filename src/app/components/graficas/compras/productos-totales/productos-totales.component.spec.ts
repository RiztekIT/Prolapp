import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosTotalesComponent } from './productos-totales.component';

describe('ProductosTotalesComponent', () => {
  let component: ProductosTotalesComponent;
  let fixture: ComponentFixture<ProductosTotalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductosTotalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosTotalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
