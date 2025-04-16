import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private baseUrl = 'https://localhost:44374/api/Tickets';

  constructor(private http: HttpClient) {}

  getMyBookings(customerId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/customerTickets/${customerId}`);
  }
}