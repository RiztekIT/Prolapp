import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVendedorComponent } from './add-vendedor.component';

describe('AddVendedorComponent', () => {
  let component: AddVendedorComponent;
  let fixture: ComponentFixture<AddVendedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVendedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVendedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
