import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTraficoComponent } from './dashboard-trafico.component';

describe('DashboardTraficoComponent', () => {
  let component: DashboardTraficoComponent;
  let fixture: ComponentFixture<DashboardTraficoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardTraficoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardTraficoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
