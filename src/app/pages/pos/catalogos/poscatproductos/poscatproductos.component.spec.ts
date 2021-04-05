import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoscatproductosComponent } from './poscatproductos.component';

describe('PoscatproductosComponent', () => {
  let component: PoscatproductosComponent;
  let fixture: ComponentFixture<PoscatproductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoscatproductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoscatproductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
