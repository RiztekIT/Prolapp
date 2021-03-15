import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleterasTraficoComponent } from './fleteras-trafico.component';

describe('FleterasTraficoComponent', () => {
  let component: FleterasTraficoComponent;
  let fixture: ComponentFixture<FleterasTraficoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleterasTraficoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleterasTraficoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
