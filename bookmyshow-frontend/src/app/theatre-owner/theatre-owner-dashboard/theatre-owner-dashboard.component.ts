import { Component, OnInit } from '@angular/core';
import { TheatreService } from 'src/app/services/theatre.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-theatre-owner-dashboard',
  templateUrl: './theatre-owner-dashboard.component.html',
  styleUrls: ['./theatre-owner-dashboard.component.css']
})
export class TheatreOwnerDashboardComponent implements OnInit {
  theatres: any[] = [];
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

    this.theatreService.getTheatresByOwner(ownerId).subscribe({
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
        
        this.calculateTotals();
      },
      error: (err: any) => console.error('Error fetching theatres:', err)
    });
  }

  calculateTotals(): void {
    this.totalScreens = 0;
    this.totalShows = 0;

    for (const theatre of this.theatres) {
      if (theatre.screens) {
        this.totalScreens += theatre.screens.length;
        for (const screen of theatre.screens) {
          if (screen.shows) {
            this.totalShows += screen.shows.length;
          }
        }
      }
    }
  }
}