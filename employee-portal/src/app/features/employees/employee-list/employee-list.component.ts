import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { EmployeeService } from '../../../core/services/employee.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Employee, Department, EmploymentStatus } from '../../../core/models/employee.model';
import { Pagination } from '../../../core/models/api-response.model';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  employees: Employee[] = [];
  departments: Department[] = [];
  pagination: Pagination | null = null;
  isLoading = false;

  displayedColumns = ['avatar', 'employeeId', 'name', 'department', 'position', 'status', 'hireDate', 'actions'];

  searchControl      = new FormControl('');
  departmentControl  = new FormControl('');
  statusControl      = new FormControl('');

  page     = 0;
  pageSize = 10;
  sortBy   = 'firstName';
  sortDir: 'asc' | 'desc' = 'asc';

  statusOptions: { value: EmploymentStatus; label: string }[] = [
    { value: 'active',     label: 'Active' },
    { value: 'inactive',   label: 'Inactive' },
    { value: 'on_leave',   label: 'On Leave' },
    { value: 'terminated', label: 'Terminated' },
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private employeeService: EmployeeService,
    private notification: NotificationService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.loadEmployees();

    // Search with debounce
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
    ).subscribe(() => { this.page = 0; this.loadEmployees(); });

    // Filter changes
    this.departmentControl.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => { this.page = 0; this.loadEmployees(); });

    this.statusControl.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => { this.page = 0; this.loadEmployees(); });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadEmployees(): void {
    this.isLoading = true;

    this.employeeService
      .getEmployees({
        page:         this.page + 1,
        pageSize:     this.pageSize,
        search:       this.searchControl.value ?? undefined,
        departmentId: this.departmentControl.value ?? undefined,
        status:       (this.statusControl.value as EmploymentStatus) ?? undefined,
        sortBy:       this.sortBy,
        sortDir:      this.sortDir,
      })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe({
        next: res => {
          this.employees  = res.data;
          this.pagination = res.pagination;
        },
      });
  }

  loadDepartments(): void {
    this.employeeService.getDepartments().pipe(takeUntil(this.destroy$)).subscribe({
      next: deps => (this.departments = deps),
    });
  }

  onPageChange(event: PageEvent): void {
    this.page     = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadEmployees();
  }

  onSort(event: Sort): void {
    this.sortBy  = event.active;
    this.sortDir = event.direction as 'asc' | 'desc';
    this.loadEmployees();
  }

  viewEmployee(id: string): void {
    this.router.navigate(['/employees', id]);
  }

  editEmployee(id: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/employees', id, 'edit']);
  }

  deleteEmployee(employee: Employee, event: Event): void {
    event.stopPropagation();

    const data: ConfirmationDialogData = {
      title:       'Delete Employee',
      message:     `Are you sure you want to delete ${employee.firstName} ${employee.lastName}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText:  'Cancel',
      type:        'danger',
    };

    this.dialog
      .open(ConfirmationDialogComponent, { data, width: '420px' })
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(confirmed => {
        if (!confirmed) return;
        this.employeeService.deleteEmployee(employee.id).subscribe({
          next: () => {
            this.notification.success(`${employee.firstName} ${employee.lastName} has been removed.`);
            this.loadEmployees();
          },
        });
      });
  }

  clearFilters(): void {
    this.searchControl.reset('');
    this.departmentControl.reset('');
    this.statusControl.reset('');
  }

  get hasActiveFilters(): boolean {
    return !!(
      this.searchControl.value ||
      this.departmentControl.value ||
      this.statusControl.value
    );
  }

  statusClass(status: EmploymentStatus): string {
    const map: Record<EmploymentStatus, string> = {
      active:     'badge-success',
      inactive:   'badge-default',
      on_leave:   'badge-warn',
      terminated: 'badge-danger',
    };
    return map[status];
  }
}
