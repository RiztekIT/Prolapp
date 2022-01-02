import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelarcfdiComponent } from './cancelarcfdi.component';

describe('CancelarcfdiComponent', () => {
  let component: CancelarcfdiComponent;
  let fixture: ComponentFixture<CancelarcfdiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelarcfdiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelarcfdiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
