import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatCountDialogComponent } from './seat-count-dialog.component';

describe('SeatCountDialogComponent', () => {
  let component: SeatCountDialogComponent;
  let fixture: ComponentFixture<SeatCountDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeatCountDialogComponent]
    });
    fixture = TestBed.createComponent(SeatCountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
