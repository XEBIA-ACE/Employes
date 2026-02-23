import { createReducer, on } from '@ngrx/store';
import { User } from '../../core/models/user.model';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,

  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    isLoading: false,
    isAuthenticated: true,
    user,
    error: null,
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    isAuthenticated: false,
    user: null,
    error,
  })),

  // Logout
  on(AuthActions.logout, (state) => ({
    ...state,
    isLoading: true,
  })),

  on(AuthActions.logoutSuccess, () => ({
    ...initialState,
  })),

  // Refresh token
  on(AuthActions.refreshTokenSuccess, (state) => ({
    ...state,
    isAuthenticated: true,
  })),

  on(AuthActions.refreshTokenFailure, () => ({
    ...initialState,
  })),

  // Load current user
  on(AuthActions.loadCurrentUser, (state) => ({
    ...state,
    isLoading: true,
  })),

  on(AuthActions.loadCurrentUserSuccess, (state, { user }) => ({
    ...state,
    isLoading: false,
    isAuthenticated: true,
    user,
  })),

  on(AuthActions.loadCurrentUserFailure, () => ({
    ...initialState,
  })),

  // Clear error
  on(AuthActions.clearAuthError, (state) => ({
    ...state,
    error: null,
  })),
);
