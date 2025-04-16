import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MovieService } from 'src/app/services/movie.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-customer-home',
  templateUrl: './customer-home.component.html',
  styleUrls: ['./customer-home.component.css']
})
export class CustomerHomeComponent implements OnInit {
  movies: any[] = [];
  role: string | null = null;

  constructor(
    private movieService: MovieService,
    private router: Router,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.role = this.tokenService.getRole();

    this.movieService.getMovies().subscribe({
      next: (res: any) => this.movies = res.data ?? res,
      error: err => console.error('Error fetching movies:', err)
    });
  }

  goToMovie(movieId: string) {
    this.router.navigate(['/customer/movie', movieId]);
  }
}