import { Component, OnInit } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';
import { Movie } from 'src/app/models/movie.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];

  constructor(private movieService: MovieService, private router: Router) {}

  ngOnInit(): void {
    this.movieService.getMovies().subscribe(res => {
      this.movies = res.data;
    });
  }

  deleteMovie(id: string): void {
    if (confirm('Are you sure you want to delete this movie?')) {
      this.movieService.deleteMovie(id).subscribe(() => {
        this.movies = this.movies.filter(m => m.movieId !== id);
      });
    }
  }

  editMovie(movieId: string): void {
    this.router.navigate(['/admin/edit-movie', movieId]);
  }  

  navigateToAdd(): void {
    this.router.navigate(['/admin/add-movie']);
  }

  getPosterUrl(posterUrl: string): string {
    if (!posterUrl) return '';
    if (posterUrl.startsWith('http')) return posterUrl;
    return `https://localhost:44374/${posterUrl}`;
  }
}