import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditposproductosComponent } from './addeditposproductos.component';

describe('AddeditposproductosComponent', () => {
  let component: AddeditposproductosComponent;
  let fixture: ComponentFixture<AddeditposproductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddeditposproductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditposproductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
