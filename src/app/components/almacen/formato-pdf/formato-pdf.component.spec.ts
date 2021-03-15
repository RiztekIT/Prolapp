import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoPDFComponent } from './formato-pdf.component';

describe('FormatoPDFComponent', () => {
  let component: FormatoPDFComponent;
  let fixture: ComponentFixture<FormatoPDFComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoPDFComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoPDFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
