// customer.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private baseUrl = 'https://localhost:44374/api/User';

  constructor(private http: HttpClient) {}

  getAllMovies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/movies`);
  }

  searchMovies(keyword: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/movies/search?keyword=${keyword}`);
  }

  getMyBookings(customerId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/bookings/${customerId}`);
  }

  getCustomerProfile(customerId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/profile/${customerId}`);
  }
}