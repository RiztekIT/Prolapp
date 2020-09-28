import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddfordwardComponent } from './addfordward.component';

describe('AddfordwardComponent', () => {
  let component: AddfordwardComponent;
  let fixture: ComponentFixture<AddfordwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddfordwardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddfordwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
