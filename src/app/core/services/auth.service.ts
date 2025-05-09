import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly router = inject(Router);

  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private readonly userToken = signal<string | null>(null);

  constructor() {
    this.loadTokenFromStorage(); // Verifica el almacenamiento local al inicializar el servicio
  }

  getToken(): string | null {
    return this.userToken();
  }

  userExists(email: string): Observable<{ exists: boolean }> {
    return this.http.post<{ exists: boolean }>(`${this.apiUrl}/exists`, {
      email,
    });
  }

  register(email: string) {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/register`, { email })
      .subscribe((res) => {
        this.setToken(res.token);
        this.saveTokenInStorage(res.token);
        this.router.navigate(['/tasks']);
      });
  }

  login(email: string) {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/login`, { email })
      .subscribe((res) => {
        this.setToken(res.token);
        this.saveTokenInStorage(res.token);
        this.router.navigate(['/tasks']);
      });
  }

  logout() {
    this.userToken.set(null);
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  setToken(token: string) {
    this.userToken.set(token);
  }

  private loadTokenFromStorage() {
    const token = localStorage.getItem('token');

    if (!token) return;
    this.setToken(token);
  }

  private saveTokenInStorage(token: string) {
    localStorage.setItem('token', token);
  }
}
