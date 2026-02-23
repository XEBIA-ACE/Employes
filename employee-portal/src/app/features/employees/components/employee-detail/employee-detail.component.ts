import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { AppState } from '../../../../store/app.state';
import { loadEmployeeById } from '../../../../store/employees/employees.actions';
import { selectSelectedEmployee, selectEmployeesLoading } from '../../../../store/employees/employees.selectors';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
})
export class EmployeeDetailComponent implements OnInit, OnDestroy {
  employee: Employee | null = null;
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(loadEmployeeById({ id }));
    }

    this.store
      .select(selectSelectedEmployee)
      .pipe(takeUntil(this.destroy$))
      .subscribe((employee) => (this.employee = employee));

    this.store
      .select(selectEmployeesLoading)
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => (this.isLoading = loading));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onEdit(): void {
    this.router.navigate(['/employees', this.employee?.id, 'edit']);
  }

  onBack(): void {
    this.router.navigate(['/employees']);
  }

  get initials(): string {
    if (!this.employee) {
      return '';
    }
    return `${this.employee.firstName.charAt(0)}${this.employee.lastName.charAt(0)}`.toUpperCase();
  }
}
