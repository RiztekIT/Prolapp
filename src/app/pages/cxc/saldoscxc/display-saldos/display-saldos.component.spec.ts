import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaySaldosComponent } from './display-saldos.component';

describe('DisplaySaldosComponent', () => {
  let component: DisplaySaldosComponent;
  let fixture: ComponentFixture<DisplaySaldosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplaySaldosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplaySaldosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
