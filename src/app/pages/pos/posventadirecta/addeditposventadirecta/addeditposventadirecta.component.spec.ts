import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditposventadirectaComponent } from './addeditposventadirecta.component';

describe('AddeditposventadirectaComponent', () => {
  let component: AddeditposventadirectaComponent;
  let fixture: ComponentFixture<AddeditposventadirectaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddeditposventadirectaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditposventadirectaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
