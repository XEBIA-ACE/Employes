import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError, timer } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import {
  User,
  LoginCredentials,
  LoginResponse,
  AuthTokens,
  ChangePasswordRequest,
} from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';
import { LoggerService } from './logger.service';

/**
 * AuthService handles all authentication operations:
 * - Login / logout
 * - Token storage and retrieval
 * - Token refresh
 * - Current user state
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiBaseUrl}/auth`;
  private readonly TOKEN_KEY = environment.auth.tokenKey;
  private readonly REFRESH_TOKEN_KEY = environment.auth.refreshTokenKey;
  private readonly TOKEN_EXPIRY_KEY = environment.auth.tokenExpiryKey;

  /** Observable current user — null if unauthenticated */
  private currentUserSubject = new BehaviorSubject<User | null>(this.loadStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private logger: LoggerService,
  ) {}

  /** Returns the current user snapshot */
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /** True if a valid session token exists */
  get isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired();
  }

  /**
   * Authenticates user with email/password credentials.
   * Stores tokens and emits the authenticated user.
   */
  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        const { user, tokens } = response.data;
        this.storeTokens(tokens, credentials.rememberMe);
        this.storeUser(user);
        this.currentUserSubject.next(user);
        this.logger.info(`User logged in: ${user.email}`);
      }),
      switchMap((response) => [response.data]),
      catchError((error) => {
        this.logger.error('Login failed', error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Logs out the current user, clears stored tokens,
   * and redirects to the login page.
   */
  logout(): void {
    // Optionally notify the server
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      this.http.post(`${this.apiUrl}/logout`, { refreshToken }).subscribe({
        error: (err) => this.logger.warn('Server logout failed', err),
      });
    }

    this.clearSession();
    this.router.navigate(['/auth/login']);
    this.logger.info('User logged out');
  }

  /**
   * Requests a new access token using the stored refresh token.
   */
  refreshToken(): Observable<AuthTokens> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<ApiResponse<AuthTokens>>(`${this.apiUrl}/refresh`, { refreshToken })
      .pipe(
        tap((response) => {
          this.storeTokens(response.data);
          this.logger.debug('Access token refreshed');
        }),
        switchMap((response) => [response.data]),
        catchError((error) => {
          this.logger.error('Token refresh failed', error);
          this.clearSession();
          this.router.navigate(['/auth/login']);
          return throwError(() => error);
        }),
      );
  }

  /**
   * Sends a password reset link to the given email address.
   */
  requestPasswordReset(email: string): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/forgot-password`, { email });
  }

  /**
   * Resets the user's password using the provided token.
   */
  resetPassword(token: string, newPassword: string): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/reset-password`, {
      token,
      newPassword,
    });
  }

  /**
   * Changes the current user's password.
   */
  changePassword(request: ChangePasswordRequest): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/change-password`, request);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return (
      localStorage.getItem(this.REFRESH_TOKEN_KEY) ||
      sessionStorage.getItem(this.REFRESH_TOKEN_KEY)
    );
  }

  isTokenExpired(): boolean {
    const expiry =
      localStorage.getItem(this.TOKEN_EXPIRY_KEY) ||
      sessionStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (!expiry) {
      return true;
    }
    return Date.now() > parseInt(expiry, 10);
  }

  hasRole(role: string): boolean {
    const user = this.currentUser;
    return !!user && (user.roles.includes(role as any) || user.role === role);
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some((role) => this.hasRole(role));
  }

  // ---- Private helpers ----

  private storeTokens(tokens: AuthTokens, persistent = false): void {
    const storage = persistent ? localStorage : sessionStorage;
    storage.setItem(this.TOKEN_KEY, tokens.accessToken);
    storage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    storage.setItem(
      this.TOKEN_EXPIRY_KEY,
      String(Date.now() + tokens.expiresIn * 1000),
    );
  }

  private storeUser(user: User): void {
    sessionStorage.setItem('current_user', JSON.stringify(user));
  }

  private loadStoredUser(): User | null {
    try {
      const stored = sessionStorage.getItem('current_user');
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  }

  private clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    sessionStorage.clear();
    this.currentUserSubject.next(null);
  }
}
