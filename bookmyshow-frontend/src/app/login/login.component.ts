import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ActivatedRoute } from '@angular/router'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  onSubmit() {
    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (res) => {
        const token = res.data;
        localStorage.setItem('token', token);

        const decodedToken: any = jwtDecode(token);
        const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

        // Redirect based on role
        switch (role) {
          case 'Admin':
            this.router.navigate(['/admin']);
            break;
          case 'Customer':
            this.router.navigate(['/']);
            break;
          case 'TheatreOwner':
            this.router.navigate(['/theatre-owner']);
            break;
          default:
            alert('Unauthorized role');
            this.router.navigate(['/unauthorized']);
        }
      },
      error: () => {
        alert('Login failed');
      }
    });
  }
}