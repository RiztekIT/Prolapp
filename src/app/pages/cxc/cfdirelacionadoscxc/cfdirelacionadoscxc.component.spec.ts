import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CfdirelacionadoscxcComponent } from './cfdirelacionadoscxc.component';

describe('CfdirelacionadoscxcComponent', () => {
  let component: CfdirelacionadoscxcComponent;
  let fixture: ComponentFixture<CfdirelacionadoscxcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CfdirelacionadoscxcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CfdirelacionadoscxcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
