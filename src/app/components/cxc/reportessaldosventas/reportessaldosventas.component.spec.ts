import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportessaldosventasComponent } from './reportessaldosventas.component';

describe('ReportessaldosventasComponent', () => {
  let component: ReportessaldosventasComponent;
  let fixture: ComponentFixture<ReportessaldosventasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportessaldosventasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportessaldosventasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
