import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidenciasOCComponent } from './evidencias-oc.component';

describe('EvidenciasOCComponent', () => {
  let component: EvidenciasOCComponent;
  let fixture: ComponentFixture<EvidenciasOCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvidenciasOCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidenciasOCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
