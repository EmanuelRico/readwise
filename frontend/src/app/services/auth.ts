// services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private _isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  isLoggedIn$ = this._isLoggedIn$.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this._isLoggedIn$.next(true);
      })
    );
  }

  register(name: string, username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { name, username, password });
  }

  logout(): void {
    localStorage.removeItem('token');
    this._isLoggedIn$.next(false);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}