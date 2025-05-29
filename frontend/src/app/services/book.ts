import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Review {
  _id?: string;
  review: string;
  createdAt?: string;
}

export interface Book {
  _id?: string;
  title: string;
  author: string;
  description?: string;
  image?: string;
  rating?: number;
  reviews?: Review[];
}

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = 'http://localhost:3000/api/books'; // asegúrate de que el backend use esta ruta

  constructor(private http: HttpClient) { }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  getBook(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  createBook(data: Book): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateBook(id: string, data: Book): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteBook(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addReview(bookId: string, review: Partial<Review>): Observable<Book> {
    return this.http.post<Book>(`${this.apiUrl}/${bookId}/reviews`, review);
  }

  deleteReview(bookId: string, reviewId: string) {
    return this.http.delete<Book>(`${this.apiUrl}/${bookId}/reviews/${reviewId}`);
  }


}