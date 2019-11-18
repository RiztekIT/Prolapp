import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoImportacionImportacionComponent } from './formato-importacion-importacion.component';

describe('FormatoImportacionImportacionComponent', () => {
  let component: FormatoImportacionImportacionComponent;
  let fixture: ComponentFixture<FormatoImportacionImportacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoImportacionImportacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoImportacionImportacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
