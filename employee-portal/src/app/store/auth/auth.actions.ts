import { createAction, props } from '@ngrx/store';
import { LoginCredentials, User, AuthTokens } from '../../core/models/user.model';

// Login
export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginCredentials }>(),
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; tokens: AuthTokens }>(),
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>(),
);

// Logout
export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

// Refresh token
export const refreshToken = createAction('[Auth] Refresh Token');

export const refreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{ tokens: AuthTokens }>(),
);

export const refreshTokenFailure = createAction(
  '[Auth] Refresh Token Failure',
  props<{ error: string }>(),
);

// Load current user (on app init)
export const loadCurrentUser = createAction('[Auth] Load Current User');

export const loadCurrentUserSuccess = createAction(
  '[Auth] Load Current User Success',
  props<{ user: User }>(),
);

export const loadCurrentUserFailure = createAction(
  '[Auth] Load Current User Failure',
  props<{ error: string }>(),
);

// Clear auth error
export const clearAuthError = createAction('[Auth] Clear Error');
