import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcusecancelacionComponent } from './acusecancelacion.component';

describe('AcusecancelacionComponent', () => {
  let component: AcusecancelacionComponent;
  let fixture: ComponentFixture<AcusecancelacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcusecancelacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcusecancelacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
