import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotacreditoComponent } from './notacredito.component';

describe('NotacreditoComponent', () => {
  let component: NotacreditoComponent;
  let fixture: ComponentFixture<NotacreditoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotacreditoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotacreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
