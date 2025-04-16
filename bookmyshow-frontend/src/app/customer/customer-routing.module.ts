import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { ShowListComponent } from './show-list/show-list.component';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { MovieDetailComponent } from './movie-details/movie-details.component';
import { SeatSelectionComponent } from './seat-selection/seat-selection.component';
import { AuthGuard } from '../guards/auth.guard';
import { CustomerHomeComponent } from './customer-home/customer-home.component';
import { ProfileComponent } from '../shared/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: CustomerHomeComponent },
      { path: 'account', component: CustomerDashboardComponent },
      { path: 'shows', component: ShowListComponent },
      {
        path: 'bookings',
        component: MyBookingsComponent,
        canActivate: [AuthGuard],
        data: { roles: ['Customer'] }
      },
      { path: 'movie/:id', component: MovieDetailComponent },
      { path: 'select-seats/:showId', component: SeatSelectionComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }