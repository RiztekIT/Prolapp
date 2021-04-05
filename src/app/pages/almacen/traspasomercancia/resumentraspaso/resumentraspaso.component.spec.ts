import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumentraspasoComponent } from './resumentraspaso.component';

describe('ResumentraspasoComponent', () => {
  let component: ResumentraspasoComponent;
  let fixture: ComponentFixture<ResumentraspasoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumentraspasoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumentraspasoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
