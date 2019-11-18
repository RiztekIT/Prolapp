import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatofacturaTraficoComponent } from './formatofactura-trafico.component';

describe('FormatofacturaTraficoComponent', () => {
  let component: FormatofacturaTraficoComponent;
  let fixture: ComponentFixture<FormatofacturaTraficoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatofacturaTraficoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatofacturaTraficoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
