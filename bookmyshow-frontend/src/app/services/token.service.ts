import { jwtDecode } from "jwt-decode";
import { Injectable } from '@angular/core';

export interface JwtPayload {
  sub: string;
  name: string;
  exp: number;
  role: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})

export class TokenService {
  static getPayload(): JwtPayload | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      return jwtDecode<JwtPayload>(token);
    } catch (e) {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return decoded?.sub ?? null;
    } catch (err) {
      console.error('Token decoding error', err);
      return null;
    }
  }

  getUserName(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const decoded: any = jwtDecode(token);
    return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/name'];
  }

  getRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const decoded: any = jwtDecode(token);
    return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  }

  static isTokenExpired(): boolean {
    const payload = this.getPayload();
    if (!payload?.exp) return true;

    const now = Math.floor(new Date().getTime() / 1000);
    return payload.exp < now;
  }

  static isLoggedIn(): boolean {
    return !!localStorage.getItem('token') && !this.isTokenExpired();
  }

  clearToken(): void {
    localStorage.removeItem('token');
  }
}