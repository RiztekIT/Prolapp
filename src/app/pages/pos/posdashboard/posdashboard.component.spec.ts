import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosdashboardComponent } from './posdashboard.component';

describe('PosdashboardComponent', () => {
  let component: PosdashboardComponent;
  let fixture: ComponentFixture<PosdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
