import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PospagoventaComponent } from './pospagoventa.component';

describe('PospagoventaComponent', () => {
  let component: PospagoventaComponent;
  let fixture: ComponentFixture<PospagoventaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PospagoventaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PospagoventaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
