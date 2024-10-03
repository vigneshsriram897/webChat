import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:3000/api';
  private tokenKey = 'token';
  decodedToken = this.decodeToken();
  constructor(private http: HttpClient, private router: Router) {
  }

  login(email: string, password: string): any {
    return this.http.post(`${this.apiUrl}/login`, { email, password }, { observe: 'response' });
  }

  register(username: string, password: string): any {
    return this.http.post(`${this.apiUrl}/signup`, { username, password });
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login'])
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null
  }
  decodeToken() {
    const token = this.getToken();
    if (token) {
      return jwtDecode(token);
    }
    return null;
  }
  isTokenExpired(): boolean {
    const decoded: any = this.decodeToken();
    if (decoded && decoded.exp) {
      const expirationDate = new Date(decoded.exp * 1000);
      return expirationDate < new Date();
    }
    return true; // If no token or invalid, consider it expired
  }
}