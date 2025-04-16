import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private baseUrl = 'https://localhost:44374/api/Tickets';

  constructor(private http: HttpClient) {}

  bookTicket(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/bookTicket`, data);
  }

  getMyTickets(customerId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/customerTickets/${customerId}`);
  }
  
  cancelTicket(ticketId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cancelTicket/${ticketId}`);
  }  
}