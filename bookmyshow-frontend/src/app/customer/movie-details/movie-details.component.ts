import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailComponent implements OnInit {
  movie: any;
  theatres: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const movieId = this.route.snapshot.paramMap.get('id')!;
    this.movieService.getMovieById(movieId).subscribe(res => {
      this.movie = res;
      this.theatres = res.theatres ?? [];
    });
  }

  proceedToSeatSelection(show: any) {
    this.router.navigate(['/customer/select-seats', show.showId]);
  }
}
