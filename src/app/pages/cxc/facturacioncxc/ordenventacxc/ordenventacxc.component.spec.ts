import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenventacxcComponent } from './ordenventacxc.component';

describe('OrdenventacxcComponent', () => {
  let component: OrdenventacxcComponent;
  let fixture: ComponentFixture<OrdenventacxcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenventacxcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenventacxcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
