import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PossaldosclientesComponent } from './possaldosclientes.component';

describe('PossaldosclientesComponent', () => {
  let component: PossaldosclientesComponent;
  let fixture: ComponentFixture<PossaldosclientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PossaldosclientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PossaldosclientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
