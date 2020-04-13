import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdendescargatarimaComponent } from './ordendescargatarima.component';

describe('OrdendescargatarimaComponent', () => {
  let component: OrdendescargatarimaComponent;
  let fixture: ComponentFixture<OrdendescargatarimaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdendescargatarimaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdendescargatarimaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
