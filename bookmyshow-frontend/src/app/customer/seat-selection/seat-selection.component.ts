import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TheatreService } from 'src/app/services/theatre.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-seat-selection',
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.css']
})
export class SeatSelectionComponent implements OnInit {
  showId!: string;
  availableSeats: number[] = [];
  selectedSeats: number[] = [];
  ticketPrice = 0;

  constructor(
    private route: ActivatedRoute,
    private theatreService: TheatreService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.showId = this.route.snapshot.paramMap.get('id')!;
  
    const pending = localStorage.getItem('pendingSeats');
    if (pending) {
      this.selectedSeats = JSON.parse(pending);
      localStorage.removeItem('pendingSeats');
    }
  
    this.theatreService.getShowById(this.showId).subscribe({
      next: (res: any) => {
        this.availableSeats = res.availableSeats;
        this.ticketPrice = res.ticketPrice;
      },
      error: (err) => console.error('Failed to load show:', err)
    });
  }  

  toggleSeat(seat: number): void {
    if (this.selectedSeats.includes(seat)) {
      this.selectedSeats = this.selectedSeats.filter(s => s !== seat);
    } else {
      this.selectedSeats.push(seat);
    }
  }

  get totalPrice(): number {
    return this.selectedSeats.length * this.ticketPrice;
  }

  proceedToPayment(): void {
    if (!this.tokenService.getToken()) {
      localStorage.setItem('pendingSeats', JSON.stringify(this.selectedSeats));
      localStorage.setItem('pendingShowId', this.showId);
  
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/customer/select-seats/${this.showId}` }
      });
      return;
    }
  
    this.router.navigate(['/customer/payment'], {
      state: {
        showId: this.showId,
        seats: this.selectedSeats,
        total: this.totalPrice
      }
    });
  }  
}
