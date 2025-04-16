import { Component, OnInit } from '@angular/core';
import { BookingService } from 'src/app/services/booking.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit {
  tickets: any[] = [];

  constructor(
    private bookingService: BookingService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    const customerId = this.tokenService.getUserId();
    if (!customerId) return;

    this.bookingService.getMyTickets(customerId).subscribe(res => {
      this.tickets = res.data ?? res;
    });
  }

  cancelTicket(ticketId: string): void {
    if (confirm('Are you sure you want to cancel this ticket?')) {
      this.bookingService.cancelTicket(ticketId).subscribe(() => {
        alert('Ticket cancelled');
        this.loadBookings();
      });
    }
  }
}