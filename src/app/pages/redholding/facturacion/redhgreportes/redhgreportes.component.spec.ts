import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedhgreportesComponent } from './redhgreportes.component';

describe('RedhgreportesComponent', () => {
  let component: RedhgreportesComponent;
  let fixture: ComponentFixture<RedhgreportesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedhgreportesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedhgreportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
