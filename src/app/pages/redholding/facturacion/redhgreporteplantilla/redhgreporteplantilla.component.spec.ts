import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedhgreporteplantillaComponent } from './redhgreporteplantilla.component';

describe('RedhgreporteplantillaComponent', () => {
  let component: RedhgreporteplantillaComponent;
  let fixture: ComponentFixture<RedhgreporteplantillaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedhgreporteplantillaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedhgreporteplantillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
