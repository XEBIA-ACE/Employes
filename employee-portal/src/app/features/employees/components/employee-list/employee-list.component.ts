import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AppState } from '../../../../store/app.state';
import { loadEmployees, deleteEmployee } from '../../../../store/employees/employees.actions';
import {
  selectAllEmployees,
  selectEmployeesLoading,
  selectEmployeesTotal,
} from '../../../../store/employees/employees.selectors';
import { Employee } from '../../models/employee.model';
import {
  ConfirmationDialogComponent,
} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  employees: Employee[] = [];
  isLoading = false;
  total = 0;
  pageSize = 10;
  currentPage = 0;
  searchControl = new FormControl('');

  displayedColumns = [
    'avatar',
    'employeeNumber',
    'fullName',
    'department',
    'position',
    'status',
    'hireDate',
    'actions',
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadEmployees();

    this.store
      .select(selectAllEmployees)
      .pipe(takeUntil(this.destroy$))
      .subscribe((employees) => (this.employees = employees));

    this.store
      .select(selectEmployeesLoading)
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => (this.isLoading = loading));

    this.store
      .select(selectEmployeesTotal)
      .pipe(takeUntil(this.destroy$))
      .subscribe((total) => (this.total = total));

    // Live search with debounce
    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(400), distinctUntilChanged())
      .subscribe((search) => {
        this.currentPage = 0;
        this.loadEmployees(search ?? '');
      });
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.pipe(takeUntil(this.destroy$)).subscribe((sort: Sort) => {
      this.currentPage = 0;
      this.loadEmployees(this.searchControl.value ?? '', sort.active, sort.direction);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadEmployees(search = '', sortBy = 'lastName', sortOrder: 'asc' | 'desc' | '' = 'asc'): void {
    this.store.dispatch(
      loadEmployees({
        params: {
          page: this.currentPage + 1,
          limit: this.pageSize,
          search,
          sortBy,
          sortOrder: sortOrder || 'asc',
        },
      }),
    );
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadEmployees(this.searchControl.value ?? '');
  }

  onRowClick(employee: Employee): void {
    this.router.navigate(['/employees', employee.id]);
  }

  onEdit(event: Event, employee: Employee): void {
    event.stopPropagation();
    this.router.navigate(['/employees', employee.id, 'edit']);
  }

  onDelete(event: Event, employee: Employee): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Employee',
        message: `Are you sure you want to delete ${employee.fullName}? This action cannot be undone.`,
        confirmText: 'Delete',
        isDanger: true,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.store.dispatch(deleteEmployee({ id: employee.id }));
      }
    });
  }

  onExport(): void {
    // Trigger CSV export via service directly
    console.info('Export triggered');
  }

  get userInitials(): (employee: Employee) => string {
    return (e) =>
      `${e.firstName.charAt(0)}${e.lastName.charAt(0)}`.toUpperCase();
  }
}
