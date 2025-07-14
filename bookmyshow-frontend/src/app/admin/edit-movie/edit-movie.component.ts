import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from 'src/app/services/movie.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-edit-movie',
  templateUrl: './edit-movie.component.html',
  styleUrls: ['./edit-movie.component.css']
})
export class EditMovieComponent implements OnInit {
  form: FormGroup;
  movieId: string | null = null;
  selectedPoster: File | null = null;
  isLoaded = false;

  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    private router: Router,
    private route: ActivatedRoute,
    private tokenService: TokenService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      genre: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(30)]],
      rating: ['', [Validators.required, Validators.min(0), Validators.max(5)]]
    });
  }

  ngOnInit(): void {
    this.movieId = this.route.snapshot.paramMap.get('id');
    if (this.movieId) {
      this.movieService.getMovieById(this.movieId).subscribe(res => {
        const movie = res.data;
        this.form.patchValue({
          title: movie.title,
          genre: movie.genre,
          duration: movie.duration,
          rating: movie.rating
        });
        this.isLoaded = true;
      });
    }
  }

  onFileSelected(event: any): void {
    this.selectedPoster = event.target.files[0] || null;
  }

  onSubmit(): void {
    if (this.form.invalid || !this.movieId) return;

    const formData = new FormData();
    formData.append('title', this.form.value.title);
    formData.append('genre', this.form.value.genre);
    formData.append('duration', this.form.value.duration);
    formData.append('rating', this.form.value.rating);
    formData.append('adminId', this.tokenService.getUserId()!);
    if (this.selectedPoster) {
      formData.append('poster', this.selectedPoster);
    }

    this.movieService.updateMovie(this.movieId, formData).subscribe(() => {
      alert('Movie updated!');
      this.router.navigate(['/admin/movies']);
    });
  }
}
