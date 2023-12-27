import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanAndLabsComponent } from './scan-and-labs.component';

describe('ScanAndLabsComponent', () => {
  let component: ScanAndLabsComponent;
  let fixture: ComponentFixture<ScanAndLabsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScanAndLabsComponent]
    });
    fixture = TestBed.createComponent(ScanAndLabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
