import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditposentradaproductosComponent } from './addeditposentradaproductos.component';

describe('AddeditposentradaproductosComponent', () => {
  let component: AddeditposentradaproductosComponent;
  let fixture: ComponentFixture<AddeditposentradaproductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddeditposentradaproductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditposentradaproductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
