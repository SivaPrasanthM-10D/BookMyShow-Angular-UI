import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MovieService } from 'src/app/services/movie.service';
import { TheatreService } from 'src/app/services/theatre.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-show-management',
  templateUrl: './show-management.component.html',
  styleUrls: ['./show-management.component.css']
})
export class ShowManagementComponent implements OnInit {
  shows: any[] = [];
  form: FormGroup;
  screens: any[] = [];
  editingShowId: string | null = null;
  movieList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private theatreService: TheatreService,
    private tokenService: TokenService,
    private movieService: MovieService
  ) {
    this.form = this.fb.group({
      screenNumber: ['', Validators.required],
      movieId: ['', Validators.required],
      showTime: ['', Validators.required],
      showDate: ['', Validators.required],
      totalSeats: ['', [Validators.required, Validators.min(1)]],
      ticketPrice: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadMovies();
    const ownerId = this.tokenService.getUserId();

    this.theatreService.getTheatre(ownerId!).subscribe((res: any) => {
      const theatre = res?.theatre;
      this.screens = theatre?.screens ?? [];

      if (this.screens && this.screens.length > 0) {

        this.form.patchValue({ screenNumber: this.screens[0].screenNumber });
        this.loadShows();
      } else {
        console.warn('No screens found for this theatre.');
      }
    });
  }

  loadMovies(): void {
    this.movieService.getMovies().subscribe({
      next: (res: any) => {
        this.movieList = res.data ?? res;
      },
      error: (err) => {
        console.error('Error loading movies:', err);
      }
    });
  }

  loadShows(): void {
    const selectedScreen = this.screens.find(
      s => s.screenNumber == this.form.value.screenNumber
    );
    if (!selectedScreen) return;

    this.theatreService.getShows(selectedScreen.screenId).subscribe({
      next: (res) => this.shows = res,
      error: () => this.shows = []
    });
  }

  submitForm(): void {
    if (this.form.invalid) return;
  
    const selectedScreen = this.screens.find(
      s => s.screenNumber == this.form.value.screenNumber
    );
  
    if (!selectedScreen) {
      console.error("Invalid screen number selected.");
      return;
    }
  
    if (this.editingShowId) {
      
      const availableSeats = Array.from(
        { length: this.form.value.totalSeats },
        (_, i) => i + 1
      );
  
      const updateData = {
        movieId: this.form.value.movieId,
        showTime: this.form.value.showTime,
        showDate: this.formatDate(this.form.value.showDate),
        ticketPrice: this.form.value.ticketPrice,
        availableSeats: availableSeats
      };
  
      this.theatreService.updateShow(this.editingShowId, updateData).subscribe({
        next: () => {
          alert('Show updated!');
          this.resetForm();
          this.loadShows();
        },
        error: (err) => {
          console.error('Error updating show:', err);
          alert('Update failed. See console for details.');
        }
      });
    } else {
     
      const addData = {
        screenId: selectedScreen.screenId,
        movieId: this.form.value.movieId,
        showTime: this.form.value.showTime,
        showDate: this.formatDate(this.form.value.showDate),
        totalSeats: this.form.value.totalSeats,
        ticketPrice: this.form.value.ticketPrice
      };
  
      this.theatreService.addShow(addData).subscribe({
        next: () => {
          alert('Show added!');
          this.resetForm();
          this.loadShows();
        },
        error: (err) => {
          console.error('Error adding show:', err);
          alert('Add failed. See console for details.');
        }
      });
    }
  }
  
  

  resetForm(): void {
    this.editingShowId = null;
    this.form.reset({ screenNumber: this.screens[0]?.screenNumber || '' });
  }

  editShow(show: any): void {
    this.editingShowId = show.showId;

    const screen = this.screens.find(s => s.screenId === show.screenId);

    this.form.patchValue({
      screenNumber: screen?.screenNumber || '',
      movieId: show.movieId,
      showDate: this.parseDate(show.showDate),
      showTime: show.showTime,
      totalSeats: show.availableSeats?.length || 0,
      ticketPrice: show.ticketPrice
    });
  }

  deleteShow(id: string): void {
    if (confirm('Are you sure you want to delete this show?')) {
      this.theatreService.deleteShow(id).subscribe({
        next: () => {
          alert('Show deleted.');
          this.loadShows();
        },
        error: err => console.error('Delete error:', err)
      });
    }
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')
      }/${d.getFullYear()}`;
  }

  private parseDate(dateStr: string): string {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  }

  getMovieTitle(movieId: string): string {
    const movie = this.movieList.find(m => m.movieId === movieId);
    return movie?.title || 'Unknown';
  }
}