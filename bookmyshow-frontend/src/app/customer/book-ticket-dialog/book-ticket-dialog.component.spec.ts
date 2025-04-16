import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookTicketDialogComponent } from './book-ticket-dialog.component';

describe('BookTicketDialogComponent', () => {
  let component: BookTicketDialogComponent;
  let fixture: ComponentFixture<BookTicketDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookTicketDialogComponent]
    });
    fixture = TestBed.createComponent(BookTicketDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
