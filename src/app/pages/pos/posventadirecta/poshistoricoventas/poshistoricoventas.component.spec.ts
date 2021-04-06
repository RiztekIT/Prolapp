import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoshistoricoventasComponent } from './poshistoricoventas.component';

describe('PoshistoricoventasComponent', () => {
  let component: PoshistoricoventasComponent;
  let fixture: ComponentFixture<PoshistoricoventasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoshistoricoventasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoshistoricoventasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
