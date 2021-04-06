import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditposusuariosComponent } from './addeditposusuarios.component';

describe('AddeditposusuariosComponent', () => {
  let component: AddeditposusuariosComponent;
  let fixture: ComponentFixture<AddeditposusuariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddeditposusuariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditposusuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
