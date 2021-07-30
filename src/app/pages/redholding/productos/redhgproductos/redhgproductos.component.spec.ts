import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedhgproductosComponent } from './redhgproductos.component';

describe('RedhgproductosComponent', () => {
  let component: RedhgproductosComponent;
  let fixture: ComponentFixture<RedhgproductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedhgproductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedhgproductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
