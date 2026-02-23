import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';

import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import * as AuthActions from './auth.actions';

/**
 * AuthEffects handles side effects for authentication actions
 * such as API calls, navigation, and notifications.
 */
@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router,
  ) {}

  /** Calls login API when login action is dispatched */
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map((response) =>
            AuthActions.loginSuccess({
              user: response.user,
              tokens: response.tokens,
            }),
          ),
          catchError((error) =>
            of(
              AuthActions.loginFailure({
                error: error.error?.message || 'Login failed. Please check your credentials.',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /** Navigate to dashboard on successful login */
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ user }) => {
          this.notification.success(`Welcome back, ${user.firstName}!`);
          this.router.navigate(['/dashboard']);
        }),
      ),
    { dispatch: false },
  );

  /** Show error notification on login failure */
  loginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginFailure),
        tap(({ error }) => {
          this.notification.error(error);
        }),
      ),
    { dispatch: false },
  );

  /** Calls logout and clears session */
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        this.authService.logout();
      }),
      map(() => AuthActions.logoutSuccess()),
    ),
  );

  /** Navigate to login after logout */
  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          this.notification.info('You have been signed out.');
          this.router.navigate(['/auth/login']);
        }),
      ),
    { dispatch: false },
  );

  /** Refresh the access token */
  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      switchMap(() =>
        this.authService.refreshToken().pipe(
          map((tokens) => AuthActions.refreshTokenSuccess({ tokens })),
          catchError((error) =>
            of(AuthActions.refreshTokenFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );
}
