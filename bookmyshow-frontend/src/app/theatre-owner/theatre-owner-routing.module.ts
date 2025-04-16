import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { TheatreComponent } from './theatre/theatre.component';
import { ScreenManagementComponent } from './screen-management/screen-management.component';
import { ShowManagementComponent } from './show-management/show-management.component';
import { TheatreOwnerDashboardComponent } from './theatre-owner-dashboard/theatre-owner-dashboard.component';
import { ProfileComponent } from '../shared/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: TheatreOwnerDashboardComponent },
      { path: 'theatre', component: TheatreComponent },
      { path: 'screens', component: ScreenManagementComponent },
      { path: 'shows', component: ShowManagementComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TheatreOwnerRoutingModule { }
