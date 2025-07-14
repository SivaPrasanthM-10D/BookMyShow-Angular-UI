import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { TheatreService } from 'src/app/services/theatre.service';
import { TokenService } from 'src/app/services/token.service';
import { MatDialog } from '@angular/material/dialog';
import { SeatCountDialogComponent } from '../seat-count-dialog/seat-count-dialog.component';
import { NoteDialogComponent } from '../note-dialog/note-dialog.component';

@Component({
  selector: 'app-seat-selection',
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.css']
})
export class SeatSelectionComponent implements OnInit {
  showId!: string;
  availableSeats: number[] = [];
  bookedSeats: number[] = [];
  selectedSeats: number[] = [];
  ticketPrice = 0;
  seatCount: number | null = null; // default is no selection
  seatCountSelected = false;
  seatCountDialogOpened = false;

  rows: { label: string, seats: { uiNumber: number, actualNumber: number, label: string, isBooked: boolean, isAisle: boolean }[] }[] = [];

  constructor(
    private route: ActivatedRoute,
    private theatreService: TheatreService,
    private tokenService: TokenService,
    private router: Router,
    private dialog: MatDialog
  ) {
    //Listen for navigation events to re-fetch data
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadShow();
      }
    });
  }

  ngOnInit(): void {
    this.showId = this.route.snapshot.paramMap.get('showId')!;
    const pending = localStorage.getItem('pendingSeats');
    if (pending) {
      this.selectedSeats = JSON.parse(pending);
      localStorage.removeItem('pendingSeats');
    }
    this.loadShow();
  }

  openSeatCountDialog(): void {
    this.seatCount = null;
    const dialogRef = this.dialog.open(SeatCountDialogComponent, {
      width: '400px',
      data: {
        ticketPrice: this.ticketPrice,
        // Add more pricing info as needed
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.seatCount) {
        this.seatCount = result.seatCount;
        this.seatCountSelected = true;
        this.loadShow();
      }
    });
  }

  loadShow(): void {
    this.theatreService.getShowById(this.showId).subscribe({
      next: (res: any) => {
        this.ticketPrice = res.ticketPrice;
        this.availableSeats = res.availableSeats ?? [];
        this.bookedSeats = res.bookedSeats ?? [];
  
        const totalSeats = res.totalSeats || res.seatCount;
        const seatsPerRow = 24; // BookMyShow style
        const totalRows = Math.ceil(totalSeats / seatsPerRow);
        const tempRows = [];
        const secondClassRowCount = 2; // A and B
        const blockSize = 8; // 3 blocks of 8 seats for FIRST CLASS
        
        if (totalSeats === 0) {
            this.rows = [];
            return;
        }

        const allSeatNumbers = Array.from({ length: totalSeats }, (_, i) => i + 1);

        for (let i = 0; i < totalRows; i++) {
          const rowSeatsActualNumbers = allSeatNumbers.slice(i * seatsPerRow, (i + 1) * seatsPerRow);
          const rowIndex = i;
          const rowLabel = String.fromCharCode(65 + rowIndex); // A, B, C, ...

          // For FIRST CLASS (not last two rows), split into 3 blocks
          let rowSeats;
          if (i < totalRows - secondClassRowCount) {
            rowSeats = rowSeatsActualNumbers.map((seat, index) => ({
              uiNumber: index + 1,
              actualNumber: seat,
              label: `${rowLabel}${index + 1}`,
              isBooked: this.bookedSeats.includes(seat),
              isAisle: (index + 1 === blockSize) || (index + 1 === 2 * blockSize)
            }));
          } else {
            // SECOND CLASS: no split, single block
            rowSeats = rowSeatsActualNumbers.map((seat, index) => ({
              uiNumber: index + 1,
              actualNumber: seat,
              label: `${rowLabel}${index + 1}`,
              isBooked: this.bookedSeats.includes(seat),
              isAisle: false
            }));
          }
          tempRows.push({ label: rowLabel, seats: rowSeats });
        }
        // Invert rows so 'A' is last (bottom)
        this.rows = tempRows.reverse();
        // Open seat count dialog after ticket price is set, only once
        if (!this.seatCountDialogOpened) {
          this.seatCountDialogOpened = true;
          this.openSeatCountDialog();
        }
      },
      error: (err) => console.error('Failed to load show:', err)
    });
  }

  toggleSeat(actualSeat: number, row?: any): void {
    if (!this.seatCountSelected || this.seatCount == null) return;
    // Only allow selection if not already selected max seats
    if (this.selectedSeats.length === this.seatCount) {
      this.selectedSeats = [];
    }
    // Find the row containing the seat
    let targetRow = row;
    if (!targetRow) {
      for (const r of this.rows) {
        if (r.seats.some(s => s.actualNumber === actualSeat)) {
          targetRow = r;
          break;
        }
      }
    }
    if (!targetRow) return;
    // Find the index of the clicked seat in the row
    const seatIdx = targetRow.seats.findIndex((s: { actualNumber: number }) => s.actualNumber === actualSeat);
    // Try to select N consecutive available seats starting from seatIdx
    const seatsToSelect = [];
    for (let i = seatIdx; i < targetRow.seats.length && seatsToSelect.length < (this.seatCount ?? 0); i++) {
      const seat = targetRow.seats[i];
      if (!seat.isBooked) {
        seatsToSelect.push(seat.actualNumber);
      } else {
        break;
      }
    }
    if (seatsToSelect.length === this.seatCount) {
      this.selectedSeats = seatsToSelect;
    } else {
      // Not enough consecutive seats
      alert('Not enough consecutive seats available in this row.');
    }
  }

  get totalPrice(): number {
    let basePrice = 0;
    const totalRows = this.rows.length;
    const secondClassRows = totalRows >= 2 ? [this.rows[totalRows - 1], this.rows[totalRows - 2]] : [];
    for (const seatNum of this.selectedSeats) {
      // If seat is in last two rows, price is 60
      if (secondClassRows.some(row => row.seats.some(s => s.actualNumber === seatNum))) {
        basePrice += 60;
      } else {
        basePrice += this.ticketPrice;
      }
    }
    const gst = basePrice * 0.18;
    const platformFee = 30 * this.selectedSeats.length;
    return basePrice + gst + platformFee;
  }

  get selectedSeatLabels(): string[] {
    const labels: string[] = [];
    for (const row of this.rows) {
      for (const seat of row.seats) {
        if (this.selectedSeats.includes(seat.actualNumber)) {
          labels.push(seat.label);
        }
      }
    }
    return labels;
  }

  proceedToPayment(): void {
    if (!this.tokenService.getToken()) {
      localStorage.setItem('pendingSeats', JSON.stringify(this.selectedSeats));
      localStorage.setItem('pendingShowId', this.showId);
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/customer/payment` }
      });
      return;
    }
    // Show note dialog before redirecting
    const dialogRef = this.dialog.open(NoteDialogComponent, {
      width: '480px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'ok') {
    this.router.navigate(['/customer/payment'], {
          queryParams: {
        showId: this.showId,
            seats: this.selectedSeats.join(','),
        total: this.totalPrice
          }
        });
      }
    });
  }

  // Returns the group label for a given row index (after inversion)
  getRowGroupLabel(rowIndex: number): string | null {
    if (this.rows.length === 0) return null;
    const totalRows = this.rows.length;
    // Last two rows (A, B) are SECOND CLASS, rest are FIRST CLASS
    if (rowIndex === totalRows - 2) return 'SECOND CLASS'; // Only above row B
    if (rowIndex === 0) return 'FIRST CLASS'; // Only above first row
    return null;
  }
}