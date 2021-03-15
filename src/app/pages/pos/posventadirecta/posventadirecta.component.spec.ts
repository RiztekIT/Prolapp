import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosventadirectaComponent } from './posventadirecta.component';

describe('PosventadirectaComponent', () => {
  let component: PosventadirectaComponent;
  let fixture: ComponentFixture<PosventadirectaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosventadirectaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosventadirectaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
