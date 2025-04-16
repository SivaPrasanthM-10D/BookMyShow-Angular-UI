import { Component, OnInit } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';
import { Movie } from 'src/app/models/movie.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-movies',
  templateUrl: './customer-movies.component.html',
  styleUrls: ['./customer-movies.component.css']
})
export class CustomerMoviesComponent implements OnInit {
  movies: Movie[] = [];

  constructor(private movieService: MovieService, private router: Router) {}

  ngOnInit(): void {
    this.movieService.getMovies().subscribe(res => {
      this.movies = res.data ?? res;
    });
  }

  viewDetails(movieId: string): void {
    this.router.navigate(['/customer/movie', movieId]);
  }
}