import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportefacturacionfechasComponent } from './reportefacturacionfechas.component';

describe('ReportefacturacionfechasComponent', () => {
  let component: ReportefacturacionfechasComponent;
  let fixture: ComponentFixture<ReportefacturacionfechasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportefacturacionfechasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportefacturacionfechasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
