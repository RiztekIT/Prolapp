import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdendecompraclienteComponent } from './ordendecompracliente.component';

describe('OrdendecompraclienteComponent', () => {
  let component: OrdendecompraclienteComponent;
  let fixture: ComponentFixture<OrdendecompraclienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdendecompraclienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdendecompraclienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
