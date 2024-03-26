import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallRequestPageComponent } from './call-request-page.component';

describe('CallRequestPageComponent', () => {
  let component: CallRequestPageComponent;
  let fixture: ComponentFixture<CallRequestPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CallRequestPageComponent]
    });
    fixture = TestBed.createComponent(CallRequestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
