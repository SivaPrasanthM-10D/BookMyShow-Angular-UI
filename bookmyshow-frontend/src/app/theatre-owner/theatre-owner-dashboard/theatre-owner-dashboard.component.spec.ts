import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheatreOwnerDashboardComponent } from './theatre-owner-dashboard.component';

describe('TheatreOwnerDashboardComponent', () => {
  let component: TheatreOwnerDashboardComponent;
  let fixture: ComponentFixture<TheatreOwnerDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TheatreOwnerDashboardComponent]
    });
    fixture = TestBed.createComponent(TheatreOwnerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
