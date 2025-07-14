import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MovieService } from 'src/app/services/movie.service';
import { TokenService } from 'src/app/services/token.service';
import { TheatreService } from 'src/app/services/theatre.service';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ReviewService } from 'src/app/services/review.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WelcomeDialogComponent } from '../welcome-dialog/welcome-dialog.component';

@Component({
  selector: 'app-customer-home',
  templateUrl: './customer-home.component.html',
  styleUrls: ['./customer-home.component.css']
})
export class CustomerHomeComponent implements OnInit {
  movies: any[] = [];
  role: string | null = null;
  startIndex = 0;
  readonly moviesPerPage = 4;
  dialogRef: MatDialogRef<WelcomeDialogComponent> | null = null;
  searchQuery: string = '';
  searchResults: any[] = [];
  searchActive: boolean = false;
  searchBarVisible: boolean = true;
  filteredSuggestions: string[] = [];
  showSuggestions: boolean = false;

  constructor(
    private movieService: MovieService,
    private router: Router,
    private tokenService: TokenService,
    private theatreService: TheatreService,
    private reviewService: ReviewService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.role = this.tokenService.getRole();
    this.loadMoviesAndRatings();
    if (!this.role) {
      setTimeout(() => {
        this.showWelcomeDialog();
      }, 300);
    }
  }

  loadMoviesAndRatings(): void {
    this.movieService.getMovies().subscribe({
      next: (res: any) => {
        const movies = res.data ?? res;
        
        if (!movies || movies.length === 0) {
          this.movies = [];
          return;
        }

        const movieObservables = movies.map((movie: any) => 
          this.reviewService.getReviewsByMovieId(movie.movieId).pipe(
            map(reviewRes => {
              const reviews = reviewRes.data ?? reviewRes;
              const averageRating = reviews.length > 0
                ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
                : 0;
              return { ...movie, averageRating };
            }),
            catchError(() => of({ ...movie, averageRating: 0 }))
          )
        );

        forkJoin(movieObservables).subscribe((moviesWithRatings: any) => {
          this.movies = moviesWithRatings;
        });
      },
      error: err => console.error('Error fetching movies:', err)
    });
  }

  get visibleMovies() {
    return this.movies.slice(this.startIndex, this.startIndex + this.moviesPerPage);
  }

  canSlideLeft(): boolean {
    return this.startIndex > 0;
  }

  canSlideRight(): boolean {
    return this.startIndex + this.moviesPerPage < this.movies.length;
  }

  slideLeft() {
    if (this.canSlideLeft()) {
      this.startIndex--;
    }
  }

  slideRight() {
    if (this.canSlideRight()) {
      this.startIndex++;
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

  showWelcomeDialog(): void {
    if (this.dialogRef && this.dialogRef.getState() !== 2) { // 2 = CLOSED
      this.dialogRef.close();
      this.dialogRef = null;
    } else {
      this.dialogRef = this.dialog.open(WelcomeDialogComponent, {
        panelClass: 'custom-welcome-dialog',
        disableClose: false
      });
      this.dialogRef.afterClosed().subscribe(() => {
        this.dialogRef = null;
      });
    }
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    const trimmedQuery = this.searchQuery.trim().toLowerCase();
    if (trimmedQuery.length === 0) {
      this.searchActive = false;
      this.searchResults = [];
      return;
    }
    this.searchResults = this.movies.filter(movie =>
      movie.title.toLowerCase().includes(trimmedQuery) ||
      (movie.genre && movie.genre.toLowerCase().includes(trimmedQuery))
    );
    this.searchActive = true;
  }

  onCloseSearch(): void {
    this.searchActive = false;
    this.searchResults = [];
    this.searchQuery = '';
    this.showSuggestions = false;
  }

  onInputChange(): void {
    const query = this.searchQuery.trim().toLowerCase();
    if (query.length === 0) {
      this.filteredSuggestions = [];
      this.showSuggestions = false;
      return;
    }
    this.filteredSuggestions = this.movies
      .map(m => m.title)
      .filter(title => title.toLowerCase().includes(query))
      .slice(0, 7);
    this.showSuggestions = this.filteredSuggestions.length > 0 && !this.searchActive;
  }

  onSuggestionClick(suggestion: string): void {
    this.searchQuery = suggestion;
    this.showSuggestions = false;
    this.onSearch(suggestion);
  }
}