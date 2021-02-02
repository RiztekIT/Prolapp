import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditposentradaComponent } from './addeditposentrada.component';

describe('AddeditposentradaComponent', () => {
  let component: AddeditposentradaComponent;
  let fixture: ComponentFixture<AddeditposentradaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddeditposentradaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditposentradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
