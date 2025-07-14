import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReviewService } from 'src/app/services/review.service';
import { TokenService } from 'src/app/services/token.service';
import { MovieService } from 'src/app/services/movie.service';
import { Movie } from 'src/app/models/movie.model';
import { MatDialog } from '@angular/material/dialog';
import { RatingDialogComponent } from '../rating-dialog/rating-dialog.component';
import { BookingRequiredDialogComponent } from '../booking-required-dialog/booking-required-dialog.component';
import { BookingService } from 'src/app/services/booking.service';
import { TheatreService } from 'src/app/services/theatre.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-movie-reviews',
  templateUrl: './movie-reviews.component.html',
  styleUrls: ['./movie-reviews.component.css']
})
export class MovieReviewsComponent implements OnInit {
  movieId!: string;
  reviews: any[] = [];
  newReview = { rating: 5, comment: '' };
  isCustomer = false;
  customerId: string | null = null;
  movieTitle: string = '';
  posterUrl: string = '';
  customerName: string | null = null;
  hasUserReviewed = false;

  constructor(
    private route: ActivatedRoute,
    private reviewService: ReviewService,
    private tokenService: TokenService,
    private movieService: MovieService,
    public dialog: MatDialog,
    private bookingService: BookingService,
    private theatreService: TheatreService
  ) {}

  ngOnInit(): void {
    this.movieId = this.route.snapshot.paramMap.get('id')!;
    this.isCustomer = this.tokenService.getRole() === 'Customer';
    this.customerId = this.tokenService.getUserId();
    this.customerName = this.tokenService.getUserName();
    this.fetchMovieDetails();
    this.fetchReviews();
  }

  fetchMovieDetails() {
    this.movieService.getMovieById(this.movieId).subscribe({
      next: (res) => {
        const movie: Movie = res.data ?? res;
        this.movieTitle = movie.title;
        this.posterUrl = movie.posterUrl || '';
      },
      error: (err) => {
        console.error('Movie fetch error', err);
        this.movieTitle = '';
        this.posterUrl = '';
      }
    });
  }

  fetchReviews() {
    this.reviewService.getReviewsByMovieId(this.movieId).subscribe({
      next: (res) => {
        const allReviews = res.data ?? res;
        this.reviews = allReviews;
        
        if (this.customerId) {
          this.hasUserReviewed = allReviews.some((review: any) => review.userId === this.customerId);
        }
      },
      error: (err) => {
        console.error('Review fetch error', err);
        this.reviews = [];
      }
    });
  }

  openRatingDialog(): void {
    const dialogRef = this.dialog.open(RatingDialogComponent, {
      width: '500px',
      data: { movieId: this.movieId, customerId: this.customerId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addReview(result);
      }
    });
  }

  addReview(reviewData: { rating: number, comment: string }) {
    if (!this.customerId) return;

    forkJoin({
      shows: this.theatreService.getShowsByMovieName(this.movieTitle),
      tickets: this.bookingService.getMyTickets(this.customerId)
    }).subscribe({
      next: ({ shows, tickets }) => {
        const movieShowIds = new Set(shows.map((s: any) => s.showId));
        
        const hasBooked = tickets.some((ticket: any) => movieShowIds.has(ticket.showId));

        if (hasBooked) {
          const payload = {
            movieId: this.movieId,
            userId: this.customerId,
            rating: reviewData.rating,
            review: reviewData.comment
          };
          console.log('Review Payload:', payload);
          this.reviewService.addReview(payload).subscribe({
            next: () => {
              this.newReview = { rating: 10, comment: '' };
              this.fetchReviews();
            },
            error: (err) => alert('Failed to add review. Please try again.')
          });
        } else {
          this.dialog.open(BookingRequiredDialogComponent);
        }
      },
      error: (err) => {
        console.error('Could not verify bookings', err);
        alert('Could not verify your bookings. Please try again.');
      }
    });
  }

  getAverageRating(): number {
    if (!this.reviews.length) return 0;
    return this.reviews.reduce((sum, r) => sum + Number(r.rating), 0) / this.reviews.length;
  }

  getPosterUrl(posterUrl: string): string {
    if (!posterUrl) return '';
    if (posterUrl.startsWith('http')) return posterUrl;
    return `https://localhost:44374/${posterUrl}`;
  }
}