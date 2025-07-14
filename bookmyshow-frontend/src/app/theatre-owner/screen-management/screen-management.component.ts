import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TheatreService } from 'src/app/services/theatre.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-screen-management',
  templateUrl: './screen-management.component.html',
  styleUrls: ['./screen-management.component.css']
})
export class ScreenManagementComponent implements OnInit {
  screenForm: FormGroup;
  theatres: any[] = [];
  screens: any[] = [];
  selectedTheatreId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private theatreService: TheatreService,
    private tokenService: TokenService
  ) {
    this.screenForm = this.fb.group({
      screenNumber: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTheatres();
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

  get selectedTheatreName(): string {
    if (!this.selectedTheatreId) return '';
    const theatre = this.theatres.find(t => t.theatreId === this.selectedTheatreId);
    return theatre ? theatre.theatreName : '';
  }

  onTheatreSelect(theatreId: string): void {
    this.selectedTheatreId = theatreId;
    this.screens = [];
    if (theatreId) {
      this.loadScreens();
    }
  }

  loadScreens(): void {
    if (!this.selectedTheatreId) return;
    this.theatreService.getScreens(this.selectedTheatreId).subscribe({
      next: (res: any) => {
        this.screens = res.data ?? res;
      },
      error: (err: any) => console.error('Error loading screens:', err)
    });
  }

  addScreen(): void {
    if (this.screenForm.invalid || !this.selectedTheatreId) return;
  
    const screenData = {
      theatreId: this.selectedTheatreId,
      screenNumber: this.screenForm.value.screenNumber
    };
  
    this.theatreService.addScreen(screenData).subscribe({
      next: () => {
        alert('Screen added successfully!');
        this.screenForm.reset();
        this.loadScreens();
      },
      error: (err) => {
        console.error('Error adding screen:', err);
        if (err.error && typeof err.error === 'string') {
          alert(err.error);
        } else {
          alert('Something went wrong. Please try again.');
        }
      }
    });
  }
  
  deleteScreen(id: string): void {
    if (confirm('Are you sure you want to delete this screen?')) {
      this.theatreService.deleteScreen(id).subscribe({
        next: () => {
          this.loadScreens();
        },
        error: (err) => console.error('Error deleting screen:', err)
      });
    }
  }
}