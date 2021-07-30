import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedhgaddeditproductosComponent } from './redhgaddeditproductos.component';

describe('RedhgaddeditproductosComponent', () => {
  let component: RedhgaddeditproductosComponent;
  let fixture: ComponentFixture<RedhgaddeditproductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedhgaddeditproductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedhgaddeditproductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
