import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedhgaddeditclientesComponent } from './redhgaddeditclientes.component';

describe('RedhgaddeditclientesComponent', () => {
  let component: RedhgaddeditclientesComponent;
  let fixture: ComponentFixture<RedhgaddeditclientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedhgaddeditclientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedhgaddeditclientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
