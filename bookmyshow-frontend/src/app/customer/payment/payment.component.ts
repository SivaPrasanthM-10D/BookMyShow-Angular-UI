import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  showId!: string;
  seatNumbers: number[] = [];
  totalPrice = 0;
  formattedSeats: string[] = [];
  customerId!: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tokenService: TokenService,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.showId = params['showId'];
      this.seatNumbers = params['seats'] ? params['seats'].split(',').map(Number) : [];
      this.totalPrice = params['total'] ? Number(params['total']) : 0;

    const userId = this.tokenService.getUserId();
    if (!userId) {
      alert('User not logged in.');
      this.router.navigate(['/login']);
      return;
    }
    this.customerId = userId;
    this.formattedSeats = this.seatNumbers.map(seat => this.formatSeat(seat));

      if (!this.showId || !this.seatNumbers.length /*|| !this.totalPrice*/) {
      this.router.navigate(['/customer/bookings'], { replaceUrl: true });
      return;
    }
    });
  }

  formatSeat(seatNumber: number): string {
    const row = String.fromCharCode(65 + Math.floor((seatNumber - 1) / 10)); // A, B, ...
    const column = ((seatNumber - 1) % 10) + 1;
    return `${row}${column}`;
  }

  confirmBooking(): void {
    const payload = {
      customerId: this.customerId,
      showId: this.showId,
      seatNo: this.seatNumbers
    };

    this.ticketService.bookTicket(payload).subscribe({
      next: () => {
        alert('Booking successful!');
        this.router.navigate(['/customer/bookings'], { replaceUrl: true });
      },
      error: (err) => {
        console.error('Booking failed:', err);
        alert('Failed to book ticket. Please try again.');
      }
    });
  }
}