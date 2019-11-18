import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirArchivosImportacionComponent } from './subir-archivos-importacion.component';

describe('SubirArchivosImportacionComponent', () => {
  let component: SubirArchivosImportacionComponent;
  let fixture: ComponentFixture<SubirArchivosImportacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubirArchivosImportacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubirArchivosImportacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
