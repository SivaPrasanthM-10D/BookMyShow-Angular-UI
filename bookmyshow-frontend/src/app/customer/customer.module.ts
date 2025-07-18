import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';

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
import { PaymentComponent } from './payment/payment.component';
import { MatIconModule } from '@angular/material/icon';
import { SeatCountDialogComponent } from './seat-count-dialog/seat-count-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { MovieReviewsComponent } from './movie-reviews/movie-reviews.component';
import { MatInputModule } from '@angular/material/input';
import { RatingDialogComponent } from './rating-dialog/rating-dialog.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BookingRequiredDialogComponent } from './booking-required-dialog/booking-required-dialog.component';
import { WelcomeDialogComponent } from './welcome-dialog/welcome-dialog.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { NoteDialogComponent } from './note-dialog/note-dialog.component';

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
    PaymentComponent,
    SeatCountDialogComponent,
    MovieReviewsComponent,
    RatingDialogComponent,
    BookingRequiredDialogComponent,
    WelcomeDialogComponent,
    SearchBarComponent,
    NoteDialogComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatSliderModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ]
})
export class CustomerModule { }
