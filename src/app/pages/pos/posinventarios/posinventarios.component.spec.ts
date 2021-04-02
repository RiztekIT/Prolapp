import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosinventariosComponent } from './posinventarios.component';

describe('PosinventariosComponent', () => {
  let component: PosinventariosComponent;
  let fixture: ComponentFixture<PosinventariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosinventariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosinventariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
