import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TheatreService } from 'src/app/services/theatre.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-theatre',
  templateUrl: './theatre.component.html',
  styleUrls: ['./theatre.component.css']
})
export class TheatreComponent implements OnInit {
  theatre: any = null;
  form: FormGroup;
  showForm: boolean = false;

  constructor(
    private theatreService: TheatreService,
    private fb: FormBuilder,
    private tokenService: TokenService
  ) {
    this.form = this.fb.group({
      theatreName: [''],
      street: [''],
      city: ['']
    });
  }

  ngOnInit(): void {
    this.loadTheatre();
  }

  loadTheatre(): void {
    const id = this.tokenService.getUserId();
    this.theatreService.getTheatre(id!).subscribe({
      next: (res: any) => {
        this.theatre = res ?? null;
        if (this.theatre) {
          this.showForm = false; // hide form if theatre already exists
        }
      },
      error: (err) => {
        console.error('Error fetching theatre:', err);
        this.theatre = null;
      }
    });
  }

  addTheatre(): void {
    const id = this.tokenService.getUserId();
    if (this.form.valid) {
      this.theatreService.addTheatre(id!, this.form.value).subscribe({
        next: () => {
          alert('Theatre added!');
          this.form.reset();
          this.loadTheatre(); // reload and hide form
        },
        error: (err) => {
          console.error('Error adding theatre:', err);
          alert('Failed to add theatre.');
        }
      });
    }
  }

  deleteTheatre(): void {
    const id = this.tokenService.getUserId();
    this.theatreService.deleteTheatre(id!).subscribe({
      next: () => {
        alert('🗑 Theatre deleted!');
        this.theatre = null;
        this.showForm = false;
      },
      error: (err) => {
        console.error('Error deleting theatre:', err);
        alert('Failed to delete theatre.');
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }
}
