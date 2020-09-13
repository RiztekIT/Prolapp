import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasMesesComponent } from './compras-meses.component';

describe('ComprasMesesComponent', () => {
  let component: ComprasMesesComponent;
  let fixture: ComponentFixture<ComprasMesesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprasMesesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprasMesesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
