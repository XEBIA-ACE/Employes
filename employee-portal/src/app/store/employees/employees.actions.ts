import { createAction, props } from '@ngrx/store';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '../../features/employees/models/employee.model';
import { QueryParams } from '../../core/models/api-response.model';

export const loadEmployees = createAction(
  '[Employees] Load Employees',
  props<{ params?: QueryParams }>(),
);

export const loadEmployeesSuccess = createAction(
  '[Employees] Load Employees Success',
  props<{ employees: Employee[]; total: number }>(),
);

export const loadEmployeesFailure = createAction(
  '[Employees] Load Employees Failure',
  props<{ error: string }>(),
);

export const loadEmployeeById = createAction(
  '[Employees] Load Employee By ID',
  props<{ id: string }>(),
);

export const loadEmployeeByIdSuccess = createAction(
  '[Employees] Load Employee By ID Success',
  props<{ employee: Employee }>(),
);

export const loadEmployeeByIdFailure = createAction(
  '[Employees] Load Employee By ID Failure',
  props<{ error: string }>(),
);

export const createEmployee = createAction(
  '[Employees] Create Employee',
  props<{ employee: CreateEmployeeDto }>(),
);

export const createEmployeeSuccess = createAction(
  '[Employees] Create Employee Success',
  props<{ employee: Employee }>(),
);

export const createEmployeeFailure = createAction(
  '[Employees] Create Employee Failure',
  props<{ error: string }>(),
);

export const updateEmployee = createAction(
  '[Employees] Update Employee',
  props<{ id: string; employee: UpdateEmployeeDto }>(),
);

export const updateEmployeeSuccess = createAction(
  '[Employees] Update Employee Success',
  props<{ employee: Employee }>(),
);

export const updateEmployeeFailure = createAction(
  '[Employees] Update Employee Failure',
  props<{ error: string }>(),
);

export const deleteEmployee = createAction(
  '[Employees] Delete Employee',
  props<{ id: string }>(),
);

export const deleteEmployeeSuccess = createAction(
  '[Employees] Delete Employee Success',
  props<{ id: string }>(),
);

export const deleteEmployeeFailure = createAction(
  '[Employees] Delete Employee Failure',
  props<{ error: string }>(),
);

export const selectEmployee = createAction(
  '[Employees] Select Employee',
  props<{ id: string }>(),
);

export const clearSelectedEmployee = createAction('[Employees] Clear Selected Employee');
