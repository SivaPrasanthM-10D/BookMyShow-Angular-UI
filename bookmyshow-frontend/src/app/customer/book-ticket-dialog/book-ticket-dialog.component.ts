import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BookingService } from 'src/app/services/booking.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-book-ticket-dialog',
  templateUrl: './book-ticket-dialog.component.html'
})
export class BookTicketDialogComponent {
  selectedSeats: number[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BookTicketDialogComponent>,
    private bookingService: BookingService,
    private tokenService: TokenService
  ) {}

  toggleSeat(seat: number) {
    const index = this.selectedSeats.indexOf(seat);
    index > -1 ? this.selectedSeats.splice(index, 1) : this.selectedSeats.push(seat);
  }

  confirmBooking() {
    const customerId = this.tokenService.getUserId();
    this.bookingService.bookTicket({
      showId: this.data.showId,
      customerId,
      seatNo: this.selectedSeats
    }).subscribe(() => {
      alert('Booking successful!');
      this.dialogRef.close();
    });
  }
}