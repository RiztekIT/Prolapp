import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardredhgComponent } from './dashboardredhg.component';

describe('DashboardredhgComponent', () => {
  let component: DashboardredhgComponent;
  let fixture: ComponentFixture<DashboardredhgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardredhgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardredhgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
