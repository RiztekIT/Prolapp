import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedhgaddeditproductostercerosComponent } from './redhgaddeditproductosterceros.component';

describe('RedhgaddeditproductostercerosComponent', () => {
  let component: RedhgaddeditproductostercerosComponent;
  let fixture: ComponentFixture<RedhgaddeditproductostercerosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedhgaddeditproductostercerosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedhgaddeditproductostercerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
