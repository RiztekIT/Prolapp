import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplementodepagoclienteComponent } from './complementodepagocliente.component';

describe('ComplementodepagoclienteComponent', () => {
  let component: ComplementodepagoclienteComponent;
  let fixture: ComponentFixture<ComplementodepagoclienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplementodepagoclienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplementodepagoclienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
