import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosinventariosComponent } from './productosinventarios.component';

describe('ProductosinventariosComponent', () => {
  let component: ProductosinventariosComponent;
  let fixture: ComponentFixture<ProductosinventariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductosinventariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosinventariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
