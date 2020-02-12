import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenarioComponent } from './calenario.component';

describe('CalenarioComponent', () => {
  let component: CalenarioComponent;
  let fixture: ComponentFixture<CalenarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalenarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
