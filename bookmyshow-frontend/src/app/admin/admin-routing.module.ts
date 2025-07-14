import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { AddMovieComponent } from './add-movie/add-movie.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ProfileComponent } from '../shared/profile/profile.component';
import { EditMovieComponent } from './edit-movie/edit-movie.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';

const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  children: [
    { path: '', component: AdminDashboardComponent },
    { path: 'movies', component: MovieListComponent },
    { path: 'add-movie', component: AddMovieComponent },
    { path: 'edit-movie/:id', component: EditMovieComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'users', component: ManageUsersComponent }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }