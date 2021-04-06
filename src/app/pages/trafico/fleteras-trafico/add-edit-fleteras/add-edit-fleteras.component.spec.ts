import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditFleterasComponent } from './add-edit-fleteras.component';

describe('AddEditFleterasComponent', () => {
  let component: AddEditFleterasComponent;
  let fixture: ComponentFixture<AddEditFleterasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditFleterasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditFleterasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
