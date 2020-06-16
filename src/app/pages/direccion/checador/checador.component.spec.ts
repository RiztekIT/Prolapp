import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecadorComponent } from './checador.component';

describe('ChecadorComponent', () => {
  let component: ChecadorComponent;
  let fixture: ComponentFixture<ChecadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChecadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
