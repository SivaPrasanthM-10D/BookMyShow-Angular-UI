import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TheatreService } from 'src/app/services/theatre.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-theatre',
  templateUrl: './theatre.component.html',
  styleUrls: ['./theatre.component.css']
})
export class TheatreComponent implements OnInit {
  theatres: any[] = [];
  form: FormGroup;
  showForm: boolean = false;
  editingTheatreId: string | null = null;
  editForm: FormGroup;

  constructor(
    private theatreService: TheatreService,
    private fb: FormBuilder,
    private tokenService: TokenService
  ) {
    this.form = this.fb.group({
      theatreName: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required]
    });

    this.editForm = this.fb.group({
      theatreName: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTheatres();
  }

  loadTheatres(): void {
    const id = this.tokenService.getUserId();
    this.theatreService.getTheatresByOwner(id!).subscribe({
      next: (res: any) => {
        const responseData = res.data ?? res;
        const theatreData = responseData?.theatres;

        if (Array.isArray(theatreData)) {
          this.theatres = theatreData;
        } else if (theatreData) {
          this.theatres = [theatreData];
        } else {
          this.theatres = [];
        }
      },
      error: (err) => {
        console.error('Error fetching theatres:', err);
        this.theatres = [];
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
          this.showForm = false;
          this.loadTheatres();
        },
        error: (err) => {
          console.error('Error adding theatre:', err);
          alert('Failed to add theatre.');
        }
      });
    }
  }

  deleteTheatre(theatreId: string): void {
    this.theatreService.deleteTheatre(theatreId).subscribe({
      next: () => {
        alert('Theatre deleted!');
        this.loadTheatres();
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

  editTheatre(theatre: any): void {
    this.editingTheatreId = theatre.theatreId;
    this.editForm.patchValue({
      theatreName: theatre.theatreName,
      street: theatre.street,
      city: theatre.city
    });
  }

  saveEdit(): void {
    if (this.editForm.valid && this.editingTheatreId) {
      const updatedTheatre = {
        ...this.editForm.value,
        theatreId: this.editingTheatreId
      };

      this.theatreService.updateTheatre(this.editingTheatreId, this.editForm.value).subscribe({
        next: () => {
          alert('Theatre updated successfully!');
          this.cancelEdit();
          this.loadTheatres();
        },
        error: (err: any) => {
          console.error('Error updating theatre:', err);
          alert('Failed to update theatre.');
        }
      });
    }
  }

  cancelEdit(): void {
    this.editingTheatreId = null;
    this.editForm.reset();
  }

  isEditing(theatreId: string): boolean {
    return this.editingTheatreId === theatreId;
  }
}