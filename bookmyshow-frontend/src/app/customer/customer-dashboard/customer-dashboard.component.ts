import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {
  userName = '';
  bookingsCount = 0;
  customerId : any;

  constructor(private tokenService: TokenService, private ticketService: TicketService) {}

  ngOnInit(): void {
    this.userName = this.tokenService.getUserName() ?? 'Guest';
    this.customerId = this.tokenService.getUserId();

    this.ticketService.getMyBookings(this.customerId).subscribe({
      next: (res: any) => this.bookingsCount = res?.length ?? 0,
      error: err => console.error('Error fetching bookings:', err)
    });
  }
}