import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class TheatreService {
  private baseUrl = 'https://localhost:44374/api/Theatres';

  constructor(private http: HttpClient) {}

  getTheatre(ownerId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${ownerId}`);
  }

  addTheatre(ownerId: string, data: any): Observable<any> {
    console.log('ownerId:', ownerId);

    return this.http.post(`${this.baseUrl}/${ownerId}`, data);
  }

  deleteTheatre(ownerId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${ownerId}`);
  }

  getScreens(theatreId: string): Observable<any> {
    return this.http.get(`https://localhost:44374/api/TheatreManagement/Screens/${theatreId}`);
  }
  
  addScreen(data: any): Observable<any> {
    return this.http.post(`https://localhost:44374/api/TheatreManagement/Screen`, data);
  }
  
  deleteScreen(screenId: string): Observable<string> {
    return this.http.delete<string>(
      `https://localhost:44374/api/TheatreManagement/Screen/${screenId}`, 
      { responseType: 'text' as 'json' }
    );
  }
  
  getShows(screenId: string): Observable<any> {
    return this.http.get(`https://localhost:44374/api/TheatreManagement/Shows/${screenId}`);
  }

  getShowById(showId: string) : Observable<any>{
    return this.http.get(`https://localhost:44374/api/TheatreManagement/Show/${showId}`);
  }

  getShowsByMovieName(movieName: string): Observable<any> {
    return this.http.get(`https://localhost:44374/api/TheatreManagement/Shows/ByMovie/${movieName}`);
  }  
  
  addShow(data: any): Observable<any> {
    return this.http.post(`https://localhost:44374/api/TheatreManagement/Show`, data);
  }
  
  updateShow(showId: string, data: any): Observable<any> {
    return this.http.put(`https://localhost:44374/api/TheatreManagement/Show/${showId}`, data);
  }
  
  deleteShow(showId: string): Observable<any> {
    return this.http.delete(`https://localhost:44374/api/TheatreManagement/Show/${showId}`, {
      responseType: 'text' as 'json'
    });
  }
  
}

