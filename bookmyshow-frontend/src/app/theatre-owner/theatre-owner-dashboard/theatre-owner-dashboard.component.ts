import { Component, OnInit } from '@angular/core';
import { TheatreService } from 'src/app/services/theatre.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-theatre-owner-dashboard',
  templateUrl: './theatre-owner-dashboard.component.html',
  styleUrls: ['./theatre-owner-dashboard.component.css']
})
export class TheatreOwnerDashboardComponent implements OnInit {
  theatre: any;
  totalScreens: number = 0;
  totalShows: number = 0;
  totalSeats: number = 0;
  totalRevenue: number = 0;

  constructor(
    private theatreService: TheatreService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    const ownerId = this.tokenService.getUserId();

    if (!ownerId) {
      console.warn('User ID not found');
      return;
    }

    this.theatreService.getTheatre(ownerId).subscribe({
      next: (res: any) => {
        this.theatre = res?.theatre;
        const screens = this.theatre?.screens ?? [];

        this.totalScreens = screens.length;

        this.totalShows = screens.reduce((showCount: number, screen: any) => {
          return showCount + (screen.shows?.length ?? 0);
        }, 0);

        this.totalSeats = screens.reduce((seatSum: number, screen: any) => {
          return seatSum + (screen.shows?.reduce((sum: number, show: any) => {
            return sum + (show.availableSeats?.length ?? 0);
          }, 0) ?? 0);
        }, 0);

        this.totalRevenue = screens.reduce((revenue: number, screen: any) => {
          return revenue + (screen.shows?.reduce((sum: number, show: any) => {
            const ticketPrice = show.ticketPrice ?? 0;
            const totalSeats = show.availableSeats?.length ?? 0;
            const seatsSold = show.totalSeats ? show.totalSeats - totalSeats : 0;
            return sum + (ticketPrice * seatsSold);
          }, 0) ?? 0);
        }, 0);
      },
      error: err => console.error('Error fetching theatre:', err)
    });
  }
}