import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MovieService } from 'src/app/services/movie.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent {
  form: FormGroup;
  selectedPoster: File | null = null;

  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      genre: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(30)]]
    });
  }

  onFileSelected(event: any): void {
    this.selectedPoster = event.target.files[0] || null;
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formData = new FormData();
    formData.append('title', this.form.value.title);
    formData.append('genre', this.form.value.genre);
    formData.append('duration', this.form.value.duration);
    formData.append('adminId', this.tokenService.getUserId()!);
    if (this.selectedPoster) {
      formData.append('poster', this.selectedPoster);
    }

    this.movieService.addMovie(formData).subscribe(() => {
      alert('Movie added!');
      this.router.navigate(['/admin/movies']);
    });
  }
}