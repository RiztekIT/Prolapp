import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardImportacionComponent } from './dashboard-importacion.component';

describe('DashboardImportacionComponent', () => {
  let component: DashboardImportacionComponent;
  let fixture: ComponentFixture<DashboardImportacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardImportacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardImportacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
