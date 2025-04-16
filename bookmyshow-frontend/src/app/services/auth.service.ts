import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:44374/api/auth/login';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<{ data: string }> {
    return this.http.post<{ data: string }>(this.apiUrl, credentials);
  }  

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
  }

  register(data: any): Observable<any> {
    return this.http.post(`https://localhost:44374/api/user`, data);
  }

  getMyProfile(userId: any) {
    return this.http.get(`https://localhost:44374/api/user/${userId}`);
  }  
}