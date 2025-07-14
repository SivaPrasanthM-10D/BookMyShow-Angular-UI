import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';

import { TheatreOwnerRoutingModule } from './theatre-owner-routing.module';
import { TheatreOwnerComponent } from './theatre-owner.component';
import { TheatreComponent } from './theatre/theatre.component';
import { ScreenManagementComponent } from './screen-management/screen-management.component';
import { ShowManagementComponent } from './show-management/show-management.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { TheatreOwnerDashboardComponent } from './theatre-owner-dashboard/theatre-owner-dashboard.component';

@NgModule({
  declarations: [
    TheatreOwnerComponent,
    TheatreComponent,
    ScreenManagementComponent,
    ShowManagementComponent,
    TheatreOwnerDashboardComponent
  ],
  imports: [
    CommonModule,
    TheatreOwnerRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatOptionModule,
    MatSelectModule,
    MatTableModule,
    MatButtonModule,
    MatSnackBarModule,
    NgxMatTimepickerModule
  ]
})
export class TheatreOwnerModule { }
