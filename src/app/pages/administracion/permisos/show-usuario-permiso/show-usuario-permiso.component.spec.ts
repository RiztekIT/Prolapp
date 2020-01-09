import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowUsuarioPermisoComponent } from './show-usuario-permiso.component';

describe('ShowUsuarioPermisoComponent', () => {
  let component: ShowUsuarioPermisoComponent;
  let fixture: ComponentFixture<ShowUsuarioPermisoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowUsuarioPermisoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowUsuarioPermisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
