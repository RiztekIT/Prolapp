import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedhgaddfacturacionComponent } from './redhgaddfacturacion.component';

describe('RedhgaddfacturacionComponent', () => {
  let component: RedhgaddfacturacionComponent;
  let fixture: ComponentFixture<RedhgaddfacturacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedhgaddfacturacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedhgaddfacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
