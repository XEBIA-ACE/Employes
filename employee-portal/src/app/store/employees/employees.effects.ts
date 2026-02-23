import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';

import { EmployeeService } from '../../features/employees/services/employee.service';
import { NotificationService } from '../../core/services/notification.service';
import * as EmployeeActions from './employees.actions';

@Injectable()
export class EmployeesEffects {
  constructor(
    private actions$: Actions,
    private employeeService: EmployeeService,
    private notification: NotificationService,
    private router: Router,
  ) {}

  loadEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.loadEmployees),
      switchMap(({ params }) =>
        this.employeeService.getEmployees(params).pipe(
          map((response) =>
            EmployeeActions.loadEmployeesSuccess({
              employees: response.data,
              total: response.pagination.total,
            }),
          ),
          catchError((error) =>
            of(EmployeeActions.loadEmployeesFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  loadEmployeeById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.loadEmployeeById),
      switchMap(({ id }) =>
        this.employeeService.getEmployeeById(id).pipe(
          map((response) =>
            EmployeeActions.loadEmployeeByIdSuccess({ employee: response.data }),
          ),
          catchError((error) =>
            of(EmployeeActions.loadEmployeeByIdFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  createEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.createEmployee),
      switchMap(({ employee }) =>
        this.employeeService.createEmployee(employee).pipe(
          map((response) =>
            EmployeeActions.createEmployeeSuccess({ employee: response.data }),
          ),
          catchError((error) =>
            of(EmployeeActions.createEmployeeFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  createEmployeeSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EmployeeActions.createEmployeeSuccess),
        tap(({ employee }) => {
          this.notification.success(`Employee ${employee.fullName} created successfully.`);
          this.router.navigate(['/employees', employee.id]);
        }),
      ),
    { dispatch: false },
  );

  updateEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.updateEmployee),
      switchMap(({ id, employee }) =>
        this.employeeService.updateEmployee(id, employee).pipe(
          map((response) =>
            EmployeeActions.updateEmployeeSuccess({ employee: response.data }),
          ),
          catchError((error) =>
            of(EmployeeActions.updateEmployeeFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  updateEmployeeSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EmployeeActions.updateEmployeeSuccess),
        tap(() => this.notification.success('Employee updated successfully.')),
      ),
    { dispatch: false },
  );

  deleteEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.deleteEmployee),
      switchMap(({ id }) =>
        this.employeeService.deleteEmployee(id).pipe(
          map(() => EmployeeActions.deleteEmployeeSuccess({ id })),
          catchError((error) =>
            of(EmployeeActions.deleteEmployeeFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  deleteEmployeeSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EmployeeActions.deleteEmployeeSuccess),
        tap(() => {
          this.notification.success('Employee deleted successfully.');
          this.router.navigate(['/employees']);
        }),
      ),
    { dispatch: false },
  );
}
