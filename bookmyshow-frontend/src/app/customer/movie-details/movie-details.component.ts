import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { TheatreService } from 'src/app/services/theatre.service';
import { ReviewService } from 'src/app/services/review.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailComponent implements OnInit {
  movie: any;
  theatres: any[] = [];
  reviews: any[] = [];
  topReviews: any[] = [];
  averageRating = 0;
  newReview = { rating: 5, comment: '' };
  isCustomer = false;
  customerId: string | null = null;
  userName: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private theatreService: TheatreService,
    private router: Router,
    private reviewService: ReviewService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    const movieId = this.route.snapshot.paramMap.get('id')!;
    this.userName = this.tokenService.getUserName();
    
    this.movieService.getMovieById(movieId).subscribe({
      next: (res) => {
        this.movie = res.data;

        // Once movie is available, use the title to fetch shows
        this.loadShowsGroupedByTheatre(this.movie.title);
        this.fetchReviews(this.movie.movieId ?? movieId);
      },
      error: (err) => console.error('Movie fetch error', err)
    });

    this.isCustomer = this.tokenService.getRole() === 'Customer';
    this.customerId = this.tokenService.getUserId();
  }

  loadShowsGroupedByTheatre(movieTitle: string): void {
    this.theatreService.getShowsByMovieName(movieTitle).subscribe({
      next: (shows) => {
        const now = new Date();

        const upcomingShows = shows.filter((show: any) => {
          try {
            const [day, month, year] = show.showDate.split('-').map(Number);
            const [time, modifier] = show.showTime.split(' ');
            let [hours, minutes] = time.split(':').map(Number);

            if (modifier.toUpperCase() === 'PM' && hours < 12) {
              hours += 12;
            }
            if (modifier.toUpperCase() === 'AM' && hours === 12) {
              hours = 0;
            }
            
            // JavaScript months are 0-indexed
            const showDateTime = new Date(year, month - 1, day, hours, minutes);
            
            return showDateTime > now;
          } catch (e) {
            console.error('Error parsing show date/time', show, e);
            return false; // Exclude shows with invalid date/time format
          }
        });
        
        const grouped = this.groupShowsByTheatre(upcomingShows);
        this.theatres = grouped;
      },
      error: (err) => console.error('Show fetch error', err)
    });
  }

  groupShowsByTheatre(shows: any[]): any[] {
    const theatreMap: { [key: string]: any[] } = {};

    for (const show of shows) {
      const name = show.theatreName;
      if (!theatreMap[name]) {
        theatreMap[name] = [];
      }
      theatreMap[name].push(show);
    }

    return Object.entries(theatreMap).map(([name, shows]) => ({
      theatreName: name,
      shows: shows
    }));
  }

  proceedToSeatSelection(show: any): void {
    this.router.navigate(['/customer/select-seats', show.showId]);
  }

  getPosterUrl(posterUrl: string): string {
    if (!posterUrl) return '';
    if (posterUrl.startsWith('http')) return posterUrl;
    return `https://localhost:44374/${posterUrl}`;
  }

  fetchReviews(movieId: string) {
    this.reviewService.getReviewsByMovieId(movieId).subscribe({
      next: (res) => {
        this.reviews = res.data ?? res;
        this.topReviews = this.reviews.slice(0, 5);
        this.calculateAverageRating();
      },
      error: (err) => console.error('Review fetch error', err)
    });
  }

  calculateAverageRating(): void {
    if (!this.reviews || this.reviews.length === 0) {
      this.averageRating = 0;
      return;
    }
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = sum / this.reviews.length;
  }

  addReview() {
    if (!this.customerId) return;
    const payload = {
      movieId: this.movie.movieId,
      customerId: this.customerId,
      rating: this.newReview.rating,
      comment: this.newReview.comment
    };
    this.reviewService.addReview(payload).subscribe({
      next: () => {
        this.newReview = { rating: 5, comment: '' };
        this.fetchReviews(this.movie.movieId);
      },
      error: (err) => alert('Failed to add review')
    });
  }
}