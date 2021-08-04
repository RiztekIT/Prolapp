import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedhgclientesComponent } from './redhgclientes.component';

describe('RedhgclientesComponent', () => {
  let component: RedhgclientesComponent;
  let fixture: ComponentFixture<RedhgclientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedhgclientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedhgclientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
