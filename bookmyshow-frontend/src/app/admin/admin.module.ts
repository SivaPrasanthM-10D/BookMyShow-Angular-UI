import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { AddMovieComponent } from './add-movie/add-movie.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { MatListModule } from '@angular/material/list';
import { EditMovieComponent } from './edit-movie/edit-movie.component';
import { MatIconModule } from '@angular/material/icon';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { UserDetailsDialogComponent } from './user-details-dialog/user-details-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DeleteConfirmDialogComponent } from './delete-confirm-dialog/delete-confirm-dialog.component';


@NgModule({
  declarations: [
    AdminComponent,
    MovieListComponent,
    AddMovieComponent,
    AdminDashboardComponent,
    EditMovieComponent,
    ManageUsersComponent,
    UserDetailsDialogComponent,
    EditUserDialogComponent,
    DeleteConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    MatListModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatSnackBarModule
  ]
})
export class AdminModule { }