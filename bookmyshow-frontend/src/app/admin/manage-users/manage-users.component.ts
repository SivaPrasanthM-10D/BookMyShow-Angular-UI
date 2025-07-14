import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDetailsDialogComponent } from '../user-details-dialog/user-details-dialog.component';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  loading = false;
  error: string | null = null;
  selectedRole: string | null = null;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedRole = params['role'] || null;
      this.fetchUsers();
    });
  }

  fetchUsers(): void {
    this.loading = true;
    this.error = null;
    this.authService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res.data ?? res;
        this.filteredUsers = this.selectedRole
          ? this.users.filter(u => u.role === this.selectedRole)
          : this.users;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users.';
        this.loading = false;
      }
    });
  }

  showUserDetails(user: any): void {
    this.dialog.open(UserDetailsDialogComponent, {
      width: '400px',
      data: user
    });
  }

  editUser(user: any): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '400px',
      data: user
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.updateUser(user.userId, result).subscribe({
          next: () => {
            // Update user in UI
            const idx = this.users.findIndex(u => u.userId === user.userId);
            if (idx > -1) {
              this.users[idx] = { ...this.users[idx], ...result };
            }
            this.filteredUsers = this.selectedRole
              ? this.users.filter(u => u.role === this.selectedRole)
              : this.users;
            this.snackBar.open('User details updated successfully.', 'Close', {
              duration: 3000,
              panelClass: 'snackbar-success',
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          },
          error: () => {
            alert('Failed to update user.');
          }
        });
      } else {
        this.snackBar.open('Edit cancelled.', 'Close', {
          duration: 2500,
          panelClass: 'snackbar-cancel',
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }

  deleteUser(user: any): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '400px',
      data: user
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.authService.deleteUser(user.userId).subscribe({
          next: () => {
            this.users = this.users.filter(u => u.userId !== user.userId);
            this.filteredUsers = this.selectedRole
              ? this.users.filter(u => u.role === this.selectedRole)
              : this.users;
            this.snackBar.open('User deleted successfully.', 'Close', {
              duration: 3000,
              panelClass: 'snackbar-success',
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          },
          error: () => {
            alert('Failed to delete user.');
          }
        });
      } else {
        this.snackBar.open('Delete operation cancelled.', 'Close', {
          duration: 2500,
          panelClass: 'snackbar-cancel',
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }
}
