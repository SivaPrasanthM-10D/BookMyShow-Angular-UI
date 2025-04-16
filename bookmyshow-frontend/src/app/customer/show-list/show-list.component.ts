import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TheatreService } from 'src/app/services/theatre.service';
import { BookTicketDialogComponent } from '../book-ticket-dialog/book-ticket-dialog.component';

@Component({
  selector: 'app-show-list',
  templateUrl: './show-list.component.html',
  styleUrls: ['./show-list.component.css']
})
export class ShowListComponent {
  shows: any[] = [];
  movieName = '';

  constructor(private theatreService: TheatreService, private dialog: MatDialog) {}

  searchShows(): void {
    this.theatreService.getShowsByMovieName(this.movieName).subscribe(res => {
      this.shows = res;
    });
  }

  openBookingDialog(show: any): void {
    this.dialog.open(BookTicketDialogComponent, {
      width: '400px',
      data: show
    });
  }
}