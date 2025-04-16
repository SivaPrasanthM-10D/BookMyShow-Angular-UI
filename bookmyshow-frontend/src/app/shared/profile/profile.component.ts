import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;
  userId: string | null = '';

  constructor(private authService: AuthService, private tokenService: TokenService) {}

  ngOnInit(): void {
    this.userId = this.tokenService.getUserId();
    this.authService.getMyProfile(this.userId).subscribe({
      next: (res: any) => this.user = res,
      error: (err) => console.error('Profile fetch error:', err)
    });
  }
}