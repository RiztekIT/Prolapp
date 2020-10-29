import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosclienteComponent } from './documentoscliente.component';

describe('DocumentosclienteComponent', () => {
  let component: DocumentosclienteComponent;
  let fixture: ComponentFixture<DocumentosclienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentosclienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentosclienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
