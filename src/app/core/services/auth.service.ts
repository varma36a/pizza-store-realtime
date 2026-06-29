import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, delay, of, tap, throwError } from 'rxjs';
import { DEMO_PASSWORD, MOCK_USERS } from '../data/mock-users';
import { AuthResponse, LoginCredentials, User } from '../models/user.model';

const AUTH_TOKEN_KEY = 'pizza_store_token';
const AUTH_USER_KEY = 'pizza_store_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _currentUser = signal<User | null>(this.loadStoredUser());
  private readonly _token = signal<string | null>(this.loadStoredToken());

  readonly currentUser = this._currentUser.asReadonly();
  readonly token = this._token.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());
  readonly isAdmin = computed(() => this._currentUser()?.role === 'admin');

  constructor(private readonly router: Router) {}

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    const user = MOCK_USERS.find((u) => u.email === credentials.email);

    if (!user || credentials.password !== DEMO_PASSWORD) {
      return throwError(() => new Error('Invalid email or password')).pipe(delay(400));
    }

    const response: AuthResponse = {
      user,
      token: `mock-jwt-${user.id}-${Date.now()}`,
    };

    return of(response).pipe(
      delay(600),
      tap((res) => this.setSession(res))
    );
  }

  logout(): void {
    this._currentUser.set(null);
    this._token.set(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return this._token();
  }

  private setSession(response: AuthResponse): void {
    this._currentUser.set(response.user);
    this._token.set(response.token);
    localStorage.setItem(AUTH_TOKEN_KEY, response.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));
  }

  private loadStoredUser(): User | null {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  }

  private loadStoredToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }
}
