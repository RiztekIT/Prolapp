import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedhgfacturaComponent } from './redhgfactura.component';

describe('RedhgfacturaComponent', () => {
  let component: RedhgfacturaComponent;
  let fixture: ComponentFixture<RedhgfacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedhgfacturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedhgfacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
