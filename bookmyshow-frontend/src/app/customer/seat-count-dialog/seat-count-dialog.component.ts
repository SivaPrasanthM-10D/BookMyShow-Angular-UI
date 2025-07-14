import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-seat-count-dialog',
  templateUrl: './seat-count-dialog.component.html',
  styleUrls: ['./seat-count-dialog.component.css']
})
export class SeatCountDialogComponent {
  seatCount: number | null = null;
  seatOptions = Array.from({ length: 10 }, (_, i) => i + 1);
  hoveredCount: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<SeatCountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { ticketPrice: number }
  ) {}

  selectSeatCount(count: number) {
    this.seatCount = count;
  }

  confirm() {
    if (this.seatCount) {
      this.dialogRef.close({ seatCount: this.seatCount });
    }
  }

  get vehicleImage(): { src: string, alt: string, isPlaceholder?: boolean } {
    const count = this.hoveredCount !== null ? this.hoveredCount : this.seatCount;
    if (count == null) {
      return {
        src: 'https://img.icons8.com/color/96/000000/bicycle.png',
        alt: 'Bicycle',
        isPlaceholder: true
      };
    }
    if (count === 1) {
      return { src: 'https://img.icons8.com/color/96/000000/bicycle.png', alt: 'Bicycle' };
    } else if (count === 2) {
      return { src: 'https://img.icons8.com/color/96/000000/scooter.png', alt: 'Scooter' };
    } else if (count === 3) {
      return { src: 'https://img.icons8.com/color/96/000000/auto-rickshaw.png', alt: 'Auto Rickshaw' };
    } else if (count === 4) {
      return { src: 'https://img.icons8.com/color/96/000000/fiat-500.png', alt: 'Nano Car' };
    } else if (count >= 5 && count <= 7) {
      return { src: 'https://img.icons8.com/color/96/000000/sedan.png', alt: 'Sedan Car' };
    } else if (count >= 8 && count <= 10) {
      return { src: 'https://img.icons8.com/color/96/000000/van.png', alt: 'Mini Van' };
    } else {
      return { src: 'https://img.icons8.com/color/96/000000/scooter.png', alt: 'Scooter' };
    }
  }
} 