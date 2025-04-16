import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TheatreService } from 'src/app/services/theatre.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-screen-management',
  templateUrl: './screen-management.component.html',
  styleUrls: ['./screen-management.component.css']
})
export class ScreenManagementComponent implements OnInit {
  screenForm: FormGroup;
  screens: any[] = [];
  theatreId!: string;

  constructor(
    private fb: FormBuilder,
    private theatreService: TheatreService,
    private tokenService: TokenService
  ) {
    this.screenForm = this.fb.group({
      screenNumber: ['']
    });
  }

  ngOnInit(): void {
    this.fetchTheatreAndScreens();
  }

  fetchTheatreAndScreens() {
    const ownerId = this.tokenService.getUserId();
    this.theatreService.getTheatre(ownerId!).subscribe((res: any) => {
      this.theatreId = res.theatre.theatreId;
      this.getScreens();
    });
  }

  getScreens() {
    this.theatreService.getScreens(this.theatreId).subscribe((res: any) => {
      this.screens = res;
    });
  }

  addScreen() {
    if (this.screenForm.invalid) return;
  
    const screenData = {
      theatreId: this.theatreId,
      screenNumber: this.screenForm.value.screenNumber
    };
  
    this.theatreService.addScreen(screenData).subscribe({
      next: (res) => {
        alert('Screen added successfully!');
        this.screenForm.reset();
        this.getScreens();
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
  

  deleteScreen(id: string) {
    if (confirm('Delete this screen?')) {
      this.theatreService.deleteScreen(id).subscribe(() => {
        this.getScreens();
      });
    }
  }
}