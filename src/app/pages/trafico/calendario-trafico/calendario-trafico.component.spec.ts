import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioTraficoComponent } from './calendario-trafico.component';

describe('CalendarioTraficoComponent', () => {
  let component: CalendarioTraficoComponent;
  let fixture: ComponentFixture<CalendarioTraficoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarioTraficoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarioTraficoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
