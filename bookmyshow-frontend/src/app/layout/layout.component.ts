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

  constructor(private tokenService: TokenService, private router: Router) {}

  ngOnInit(): void {
    this.role = this.tokenService.getRole();
  }

  logout(): void {
    this.tokenService.clearToken();
    this.role = null;
    this.router.navigate(['/login']);
  }
}