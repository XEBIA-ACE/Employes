import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { environment } from '../../environments/environment';

import { authReducer, AuthState } from './auth/auth.reducer';
import { employeesReducer, EmployeesState } from './employees/employees.reducer';
import { leaveReducer, LeaveState } from './leave/leave.reducer';
import { payrollReducer, PayrollState } from './payroll/payroll.reducer';

/**
 * Global application state shape.
 * Each feature slice is managed by its own reducer.
 */
export interface AppState {
  auth: AuthState;
  employees: EmployeesState;
  leave: LeaveState;
  payroll: PayrollState;
  router: RouterReducerState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  employees: employeesReducer,
  leave: leaveReducer,
  payroll: payrollReducer,
  router: routerReducer,
};

/**
 * Meta-reducers run before feature reducers.
 * Only enabled in development mode.
 */
export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
