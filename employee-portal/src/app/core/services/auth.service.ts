import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthUser, LoginRequest, LoginResponse, ChangePasswordRequest, User } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';
import { LoggerService } from './logger.service';

const TOKEN_KEY         = 'ep_token';
const REFRESH_TOKEN_KEY = 'ep_refresh_token';
const USER_KEY          = 'ep_user';

/**
 * Authentication service — handles login, logout, token management,
 * and exposes the current authenticated user as an Observable.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  /** Emits the current authenticated user, or null when logged out. */
  private currentUserSubject = new BehaviorSubject<User | null>(this.loadStoredUser());
  readonly currentUser$ = this.currentUserSubject.asObservable();

  /** Quick boolean stream for guards / UI. */
  readonly isAuthenticated$ = this.currentUser$.pipe(map(u => !!u));

  constructor(
    private http: HttpClient,
    private router: Router,
    private logger: LoggerService,
  ) {}

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.currentUser && !this.isTokenExpired();
  }

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /** Attempt login; stores credentials on success. */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, credentials).pipe(
      map(res => res.data),
      tap(res => {
        this.storeSession(res);
        this.logger.info('User logged in', { userId: res.user.id });
      }),
      catchError(err => {
        this.logger.error('Login failed', { error: err.message });
        return throwError(() => err);
      }),
    );
  }

  /** Clears session and navigates to login. */
  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      error: err => this.logger.warn('Logout request failed', { error: err.message }),
    });
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  /** Refresh the access token using the stored refresh token. */
  refreshToken(): Observable<{ token: string }> {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    return this.http.post<ApiResponse<{ token: string }>>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      map(res => res.data),
      tap(res => localStorage.setItem(TOKEN_KEY, res.token)),
      catchError(err => {
        this.clearSession();
        return throwError(() => err);
      }),
    );
  }

  changePassword(payload: ChangePasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/change-password`, payload);
  }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reset-password`, { token, newPassword });
  }

  hasRole(role: string | string[]): boolean {
    const user = this.currentUser;
    if (!user) return false;
    return Array.isArray(role) ? role.includes(user.role) : user.role === role;
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private storeSession(res: LoginResponse): void {
    const expiresAt = Date.now() + res.expiresIn * 1000;
    const authUser: AuthUser = { ...res.user, token: res.token, refreshToken: res.refreshToken, expiresAt };
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    this.currentUserSubject.next(res.user);
  }

  private clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSubject.next(null);
  }

  private loadStoredUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }

  private isTokenExpired(): boolean {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (!raw) return true;
      const authUser = JSON.parse(raw) as AuthUser;
      return Date.now() > authUser.expiresAt;
    } catch {
      return true;
    }
  }
}
