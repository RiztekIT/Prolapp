import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioComprasComponent } from './calendario-compras.component';

describe('CalendarioComprasComponent', () => {
  let component: CalendarioComprasComponent;
  let fixture: ComponentFixture<CalendarioComprasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarioComprasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarioComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
