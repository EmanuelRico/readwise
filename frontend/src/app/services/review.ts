import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Review {
  _id?: string;  // <-- Aquí está la clave
  title: string;
  author: string;
  review: string;
  rating: number;
}

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = 'http://localhost:3000/api/reviews';

  constructor(private http: HttpClient) {}

  getReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(this.apiUrl);
  }

  getReview(id: string): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/${id}`);
  }

  createReview(data: Review): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateReview(id: string, data: Review): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteReview(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}