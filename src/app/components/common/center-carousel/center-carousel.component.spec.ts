import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterCarouselComponent } from './center-carousel.component';

describe('CenterCarouselComponent', () => {
  let component: CenterCarouselComponent;
  let fixture: ComponentFixture<CenterCarouselComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CenterCarouselComponent]
    });
    fixture = TestBed.createComponent(CenterCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
