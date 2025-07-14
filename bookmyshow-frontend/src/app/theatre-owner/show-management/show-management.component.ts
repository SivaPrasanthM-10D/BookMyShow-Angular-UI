import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MovieService } from 'src/app/services/movie.service';
import { TheatreService } from 'src/app/services/theatre.service';
import { TokenService } from 'src/app/services/token.service';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-show-management',
  templateUrl: './show-management.component.html',
  styleUrls: ['./show-management.component.css']
})
export class ShowManagementComponent implements OnInit {
  shows: any[] = [];
  form: FormGroup;
  theatres: any[] = [];
  screens: any[] = [];
  selectedTheatreId: string | null = null;
  editingShowId: string | null = null;
  movieList: any[] = [];

  minDate: Date = new Date();
  bookedTimes: string[] = [];
  showForm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private theatreService: TheatreService,
    private tokenService: TokenService,
    private movieService: MovieService
  ) {
    this.form = this.fb.group({
      screenId: ['', Validators.required],
      movieId: ['', Validators.required],
      showTime: ['', Validators.required],
      showDate: ['', Validators.required],
      totalSeats: ['', [Validators.required, Validators.min(1)]],
      ticketPrice: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadMovies();
    this.loadTheatres();
  }

  loadMovies(): void {
    this.movieService.getMovies().subscribe({
      next: (res: any) => { this.movieList = res.data ?? res; },
      error: (err) => { console.error('Error loading movies:', err); }
    });
  }

  loadTheatres(): void {
    const ownerId = this.tokenService.getUserId();
    this.theatreService.getTheatresByOwner(ownerId!).subscribe({
      next: (res: any) => {
        const ownerData = res.data ?? res;
        const theatreData = ownerData?.theatres;
        this.theatres = Array.isArray(theatreData) ? theatreData : (theatreData ? [theatreData] : []);
        if (this.theatres.length > 0) {
          this.onTheatreSelect(this.theatres[0].theatreId);
        }
      },
      error: (err: any) => console.error('Error loading theatres:', err)
    });
  }

  onTheatreSelect(theatreId: string): void {
    this.selectedTheatreId = theatreId;
    this.screens = [];
    this.shows = [];
    this.form.patchValue({ screenId: '' });

    if (theatreId) {
      this.theatreService.getScreens(theatreId).subscribe({
        next: (res: any) => {
          this.screens = res.data ?? res;
          if (this.screens.length > 0) {
            this.form.patchValue({ screenId: this.screens[0].screenId });
            this.loadShowsForSelectedScreen();
          }
        },
        error: (err) => console.error('Error loading screens:', err)
      });
    }
  }

  onScreenSelect(): void {
    this.loadShowsForSelectedScreen();
    this.onDateChange();
  }
  
  loadShowsForSelectedScreen(): void {
    const selectedScreenId = this.form.value.screenId;
    if (!selectedScreenId) {
      this.shows = [];
      return;
    }
  
    this.theatreService.getShows(selectedScreenId).subscribe({
      next: (res: any) => {
        this.shows = res.data ?? res;
      },
      error: () => this.shows = []
    });
  }

  onDateChange(): void {
    // Get selected date and screen
    const selectedDate = this.form.value.showDate;
    const selectedScreenId = this.form.value.screenId;
    if (!selectedDate || !selectedScreenId) {
      this.bookedTimes = [];
      return;
    }
    // Format date to match show.showDate
    const formattedDate = this.formatDate(selectedDate);
    // Find all shows for this screen and date
    this.bookedTimes = this.shows
      .filter(show => show.showDate === formattedDate && show.screenId === selectedScreenId)
      .map(show => show.showTime);
  }

  disableBookedTimes = (time: string): boolean => {
    // time is in format 'hh:mm AM/PM'
    return this.bookedTimes.includes(time);
  };

  // Helper to ensure time is in 'hh:mm AM/PM' format
  private toPadded12HourFormat(time: string): string {
    if (!time) return '';
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    // Pad hour to 2 digits
    const paddedHour = hours.toString().padStart(2, '0');
    return `${paddedHour}:${minutes.toString().padStart(2, '0')} ${modifier}`;
  }

  submitForm(): void {
    if (this.form.invalid) return;

    // Prevent booking if time is already taken
    if (this.bookedTimes.includes(this.form.value.showTime)) {
      alert('This time slot is already booked for the selected date and screen.');
      return;
    }

    const showTime = this.toPadded12HourFormat(this.form.value.showTime);

    if (this.editingShowId) {
      const updateData = {
        movieId: this.form.value.movieId,
        showTime: showTime,
        showDate: this.formatDate(this.form.value.showDate),
        ticketPrice: this.form.value.ticketPrice,
        availableSeats: Array.from({ length: this.form.value.totalSeats }, (_, i) => i + 1)
      };

      this.theatreService.updateShow(this.editingShowId, updateData).subscribe({
        next: () => {
          alert('Show updated!');
          this.resetForm();
          this.loadShowsForSelectedScreen();
        },
        error: (err) => alert(`Update failed: ${err.error}`)
      });
    } else {
      const addData = {
        screenId: this.form.value.screenId,
        ...this.form.value,
        showTime: showTime,
        showDate: this.formatDate(this.form.value.showDate)
      };

      this.theatreService.addShow(addData).subscribe({
        next: () => {
          alert('Show added!');
          this.resetForm();
          this.loadShowsForSelectedScreen();
        },
        error: (err) => alert(`Add failed: ${err.error}`)
      });
    }
  }

  resetForm(): void {
    this.editingShowId = null;
    this.showForm = false;
    const currentScreenId = this.form.value.screenId;
    this.form.reset({ screenId: currentScreenId });
  }

  editShow(show: any): void {
    this.editingShowId = show.showId;
    this.showForm = true;
    this.form.patchValue({
      screenId: show.screenId,
      movieId: show.movieId,
      showDate: this.parseDate(show.showDate),
      showTime: show.showTime,
      totalSeats: show.availableSeats?.length || 0,
      ticketPrice: show.ticketPrice
    });
  }

  showAddForm(): void {
    this.showForm = true;
    this.editingShowId = null;
    this.form.reset({ screenId: this.form.value.screenId });
  }

  deleteShow(id: string): void {
    if (confirm('Are you sure you want to delete this show?')) {
      this.theatreService.deleteShow(id).subscribe({
        next: () => {
          alert('Show deleted.');
          this.loadShowsForSelectedScreen();
        },
        error: err => console.error('Delete error:', err)
      });
    }
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  }

  private parseDate(dateStr: string): string {
    if (!dateStr || !dateStr.includes('/')) return '';
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  getMovieTitle(movieId: string): string {
    if (!this.movieList) return '...';
    const movie = this.movieList.find(m => m.movieId === movieId);
    return movie?.title || 'Unknown';
  }

  getScreenNumber(screenId: string): number | string {
    const screen = this.screens.find(s => s.screenId === screenId);
    return screen ? screen.screenNumber : 'N/A';
  }
}