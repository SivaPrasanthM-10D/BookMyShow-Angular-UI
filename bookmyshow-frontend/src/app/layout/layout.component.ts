import { Component, OnInit } from '@angular/core';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  role: string | null = null;
  isDarkTheme = false;

  constructor(private tokenService: TokenService, private router: Router) {}

  ngOnInit(): void {
    this.role = this.tokenService.getRole();
    // Load theme preference
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      this.isDarkTheme = true;
      document.body.classList.add('dark-theme');
    } else {
      this.isDarkTheme = false;
      document.body.classList.remove('dark-theme');
    }
  }

  logout(): void {
    this.tokenService.clearToken();
    this.role = null;
    this.router.navigate(['/']);
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    if (this.isDarkTheme) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }
}