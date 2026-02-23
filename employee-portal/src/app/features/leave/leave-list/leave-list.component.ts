import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil, finalize } from 'rxjs';
import { LeaveService } from '../../../core/services/leave.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LeaveRequest, LeaveStatus } from '../../../core/models/leave.model';

@Component({
  selector: 'app-leave-list',
  templateUrl: './leave-list.component.html',
  styleUrls: ['./leave-list.component.scss'],
})
export class LeaveListComponent implements OnInit, OnDestroy {
  leaves: LeaveRequest[] = [];
  isLoading = true;
  isManagerView = false;

  displayedColumns = ['leaveType', 'startDate', 'endDate', 'totalDays', 'reason', 'status', 'actions'];

  private destroy$ = new Subject<void>();

  constructor(
    private leaveService: LeaveService,
    private authService: AuthService,
    private notification: NotificationService,
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser;
    this.isManagerView = this.authService.hasRole(['admin', 'hr', 'manager']);
    this.loadLeaves(user?.id);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadLeaves(employeeId?: string): void {
    this.isLoading = true;

    this.leaveService
      .getLeaveRequests({ employeeId, pageSize: 50 })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe({ next: res => (this.leaves = res.data) });
  }

  cancelLeave(id: string): void {
    this.leaveService.cancelLeaveRequest(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.notification.success('Leave request cancelled.');
        const idx = this.leaves.findIndex(l => l.id === id);
        if (idx !== -1) this.leaves[idx].status = 'cancelled';
        this.leaves = [...this.leaves];
      },
    });
  }

  canCancel(leave: LeaveRequest): boolean {
    return leave.status === 'pending';
  }

  statusBadge(status: LeaveStatus): string {
    const map: Record<LeaveStatus, string> = {
      pending:   'badge-warn',
      approved:  'badge-success',
      rejected:  'badge-danger',
      cancelled: 'badge-default',
    };
    return map[status];
  }
}
