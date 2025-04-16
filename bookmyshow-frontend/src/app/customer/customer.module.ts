import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { ShowListComponent } from './show-list/show-list.component';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';
import { BookTicketDialogComponent } from './book-ticket-dialog/book-ticket-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { CustomerMoviesComponent } from './customer-movies/customer-movies.component';
import { MovieDetailComponent } from './movie-details/movie-details.component';
import { SeatSelectionComponent } from './seat-selection/seat-selection.component';


@NgModule({
  declarations: [
    CustomerComponent,
    ShowListComponent,
    MyBookingsComponent,
    BookTicketDialogComponent,
    CustomerDashboardComponent,
    CustomerMoviesComponent,
    MovieDetailComponent,
    SeatSelectionComponent,
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDialogModule,
    FormsModule,
    MatButtonModule
  ]
})
export class CustomerModule { }
