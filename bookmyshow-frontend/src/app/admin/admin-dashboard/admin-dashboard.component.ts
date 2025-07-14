import { Component, OnInit } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ReviewService } from 'src/app/services/review.service';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  totalMovies: number = 0;
  topRatedMovies: any[] = [];
  rolesCount: { [role: string]: number } = {};
  rolesList: string[] = [];

  constructor(
    private movieService: MovieService, 
    private authService: AuthService, 
    private router: Router,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.loadMoviesAndRatings();
    this.loadUsers();
  }

  loadMoviesAndRatings(): void {
    this.movieService.getMovies().subscribe({
      next: (res: any) => {
        const movies = res.data ?? res;
        this.totalMovies = movies.length;

        if (movies.length === 0) {
          this.topRatedMovies = [];
          return;
        }

        const movieObservables = movies.map((movie: any) => {
          return this.reviewService.getReviewsByMovieId(movie.movieId).pipe(
            map(reviewRes => {
              const reviews = reviewRes.data ?? reviewRes;
              const averageRating = reviews.length > 0
                ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
                : 0;
              return { ...movie, averageRating };
            }),
            catchError(() => of({ ...movie, averageRating: 0 })) // If reviews fail, default rating to 0
          );
        });

        forkJoin(movieObservables).subscribe(moviesWithRatings => {
          this.topRatedMovies = (moviesWithRatings as any[])
            .sort((a, b) => b.averageRating - a.averageRating)
            .slice(0, 5);
        });
      },
      error: err => console.error('Failed to load movies:', err)
    });
  }

  loadUsers(): void {
    this.authService.getAllUsers().subscribe({
      next: (res: any) => {
        const users = res.data ?? res;
        this.rolesCount = users.reduce((acc: any, user: any) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {});
        this.rolesList = Object.keys(this.rolesCount);
      },
      error: err => console.error('Failed to load users:', err)
    });
  }

  goToUsersByRole(role: string): void {
    this.router.navigate(['/admin/users'], { queryParams: { role } });
  }
}