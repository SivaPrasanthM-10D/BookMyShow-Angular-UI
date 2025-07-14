import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-booking-required-dialog',
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>
        <mat-icon color="warn">error_outline</mat-icon>
        <span>Rating Not Allowed</span>
      </h2>
      <mat-dialog-content>
        <p>You must book a ticket for this movie before you can submit a review.</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-flat-button color="primary" [mat-dialog-close]="true">OK</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container { text-align: center; }
    h2[mat-dialog-title] { display: flex; align-items: center; justify-content: center; gap: 8px; }
  `]
})
export class BookingRequiredDialogComponent {} 