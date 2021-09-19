import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedhgaddeditproductosfacturaComponent } from './redhgaddeditproductosfactura.component';

describe('RedhgaddeditproductosfacturaComponent', () => {
  let component: RedhgaddeditproductosfacturaComponent;
  let fixture: ComponentFixture<RedhgaddeditproductosfacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedhgaddeditproductosfacturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedhgaddeditproductosfacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
