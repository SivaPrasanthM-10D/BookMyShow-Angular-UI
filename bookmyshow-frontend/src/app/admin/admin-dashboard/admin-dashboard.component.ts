import { Component, OnInit } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  totalMovies: number = 0;
  topRatedMovies: any[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.movieService.getMovies().subscribe({
      next: (res: any) => {
        const movies = res.data ?? res;
        this.totalMovies = movies.length;
        this.topRatedMovies = [...movies]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 5);
      },
      error: err => console.error('Failed to load movies:', err)
    });
  }
}