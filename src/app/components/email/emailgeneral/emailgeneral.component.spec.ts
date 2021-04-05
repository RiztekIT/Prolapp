import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailgeneralComponent } from './emailgeneral.component';

describe('EmailgeneralComponent', () => {
  let component: EmailgeneralComponent;
  let fixture: ComponentFixture<EmailgeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailgeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailgeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
