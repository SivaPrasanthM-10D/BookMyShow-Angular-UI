import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;
  userId: string | null = '';
  editMode = false;
  editUser: any = {};
  loading = false;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userId = this.tokenService.getUserId();
    this.fetchProfile();
  }

  fetchProfile(): void {
    this.authService.getMyProfile(this.userId).subscribe({
      next: (res: any) => this.user = res,
      error: (err) => console.error('Profile fetch error:', err)
    });
  }

  startEdit(): void {
    this.editUser = { ...this.user };
    this.editMode = true;
  }

  saveEdit(): void {
    this.loading = true;
    this.authService.updateUser(this.userId!, this.editUser).subscribe({
      next: () => {
        this.user = { ...this.editUser };
        this.editMode = false;
        this.loading = false;
        this.snackBar.open('Profile updated successfully.', 'Close', {
          duration: 3000,
          panelClass: 'snackbar-success',
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to update profile.', 'Close', {
          duration: 3000,
          panelClass: 'snackbar-cancel',
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }

  cancelEdit(): void {
    this.editMode = false;
    this.snackBar.open('Edit cancelled.', 'Close', {
      duration: 2500,
      panelClass: 'snackbar-cancel',
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}