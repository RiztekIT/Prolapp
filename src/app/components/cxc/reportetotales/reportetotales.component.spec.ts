import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportetotalesComponent } from './reportetotales.component';

describe('ReportetotalesComponent', () => {
  let component: ReportetotalesComponent;
  let fixture: ComponentFixture<ReportetotalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportetotalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportetotalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
