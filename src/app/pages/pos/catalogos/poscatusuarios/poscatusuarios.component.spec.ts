import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoscatusuariosComponent } from './poscatusuarios.component';

describe('PoscatusuariosComponent', () => {
  let component: PoscatusuariosComponent;
  let fixture: ComponentFixture<PoscatusuariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoscatusuariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoscatusuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
