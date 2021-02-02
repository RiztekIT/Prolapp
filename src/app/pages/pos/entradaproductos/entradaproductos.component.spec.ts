import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntradaproductosComponent } from './entradaproductos.component';

describe('EntradaproductosComponent', () => {
  let component: EntradaproductosComponent;
  let fixture: ComponentFixture<EntradaproductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntradaproductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntradaproductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
