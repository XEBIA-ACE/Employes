import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EmployeesState, selectAll, selectEntities } from './employees.reducer';

export const selectEmployeesState = createFeatureSelector<EmployeesState>('employees');

export const selectAllEmployees = createSelector(selectEmployeesState, selectAll);

export const selectEmployeeEntities = createSelector(selectEmployeesState, selectEntities);

export const selectEmployeesLoading = createSelector(
  selectEmployeesState,
  (state) => state.isLoading,
);

export const selectEmployeesError = createSelector(
  selectEmployeesState,
  (state) => state.error,
);

export const selectEmployeesTotal = createSelector(
  selectEmployeesState,
  (state) => state.total,
);

export const selectSelectedEmployeeId = createSelector(
  selectEmployeesState,
  (state) => state.selectedEmployeeId,
);

export const selectSelectedEmployee = createSelector(
  selectEmployeeEntities,
  selectSelectedEmployeeId,
  (entities, id) => (id ? entities[id] ?? null : null),
);
