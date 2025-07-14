import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MovieService } from 'src/app/services/movie.service';
import { TokenService } from 'src/app/services/token.service';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {
  movies: any[] = [];
  role: string | null = null;
  userName = '';
  bookingsCount = 0;
  customerId: any;

  constructor(
    private movieService: MovieService,
    private router: Router,
    private tokenService: TokenService,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    this.role = this.tokenService.getRole();
    this.userName = this.tokenService.getUserName() || 'Guest';
    this.customerId = this.tokenService.getUserId();

    this.movieService.getMovies().subscribe({
      next: (res: any) => this.movies = res.data ?? res,
      error: err => console.error('Error fetching movies:', err)
    });

    if (this.customerId) {
      this.ticketService.getMyBookings(this.customerId).subscribe({
        next: (res: any) => this.bookingsCount = res?.length ?? 0,
        error: err => console.error('Error fetching bookings:', err)
      });
    }
  }

  goToMovie(movieId: string) {
    this.router.navigate(['/customer/movie', movieId]);
  }

  getPosterUrl(posterUrl: string): string {
    if (!posterUrl) return '';
    if (posterUrl.startsWith('http')) return posterUrl;
    return `https://localhost:44374/${posterUrl}`;
  }
}