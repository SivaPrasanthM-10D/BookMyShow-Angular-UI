import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private baseUrl = 'https://localhost:44374/api/Reviews';

  constructor(private http: HttpClient) {}

  getReviewsByMovieId(movieId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/ByMovieId/${movieId}`);
  }

  addReview(payload: any): Observable<any> {
    return this.http.post(this.baseUrl, payload);
  }

  getReviewsByMovieName(movieName: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${movieName}`);
  }
}