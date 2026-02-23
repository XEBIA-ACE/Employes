import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, finalize } from 'rxjs';
import { EmployeeService } from '../../../core/services/employee.service';
import { Employee } from '../../../core/models/employee.model';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
})
export class EmployeeDetailComponent implements OnInit, OnDestroy {
  employee: Employee | null = null;
  isLoading = true;

  private destroy$ = new Subject<void>();

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.employeeService
      .getEmployee(id)
      .pipe(takeUntil(this.destroy$), finalize(() => (this.isLoading = false)))
      .subscribe({ next: emp => (this.employee = emp) });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  edit(): void {
    this.router.navigate(['/employees', this.employee?.id, 'edit']);
  }

  back(): void {
    this.router.navigate(['/employees']);
  }

  get fullName(): string {
    return `${this.employee?.firstName ?? ''} ${this.employee?.lastName ?? ''}`.trim();
  }

  get initials(): string {
    if (!this.employee) return '?';
    return `${this.employee.firstName[0]}${this.employee.lastName[0]}`.toUpperCase();
  }

  statusBadge(status: string): string {
    const map: Record<string, string> = {
      active: 'badge-success', inactive: 'badge-default',
      on_leave: 'badge-warn', terminated: 'badge-danger',
    };
    return map[status] ?? 'badge-default';
  }
}
