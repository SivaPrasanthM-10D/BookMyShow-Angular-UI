import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent implements OnInit {
  form: FormGroup;
  editing: boolean = false;
  movieId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      genre: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(30)]],
      rating: ['', [Validators.required, Validators.min(0), Validators.max(10)]]
    });
  }

  ngOnInit(): void {
    this.movieId = this.route.snapshot.paramMap.get('id');
    if (this.movieId) {
      this.editing = true;
      this.movieService.getMovieById(this.movieId).subscribe(res => {
        const movie = res.data;
        this.form.patchValue({
          title: movie.title,
          genre: movie.genre,
          duration: movie.duration,
          rating: movie.rating
        });
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    if (this.editing && this.movieId) {
      this.movieService.updateMovie(this.movieId, this.form.value).subscribe(() => {
        alert('Movie updated!');
        this.router.navigate(['/admin/movies']);
      });
    } else {
      this.movieService.addMovie(this.form.value).subscribe(() => {
        alert('Movie added!');
        this.router.navigate(['/admin/movies']);
      });
    }
  }
}