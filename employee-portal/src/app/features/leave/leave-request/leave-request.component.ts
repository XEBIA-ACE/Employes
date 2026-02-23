import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil, finalize } from 'rxjs';
import { LeaveService } from '../../../core/services/leave.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LeaveBalance, LeaveType } from '../../../core/models/leave.model';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.scss'],
})
export class LeaveRequestComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  balances: LeaveBalance[] = [];
  isSaving  = false;
  isLoading = true;

  readonly leaveTypes: { value: LeaveType; label: string; icon: string }[] = [
    { value: 'annual',    label: 'Annual Leave',    icon: 'beach_access' },
    { value: 'sick',      label: 'Sick Leave',      icon: 'sick' },
    { value: 'maternity', label: 'Maternity Leave', icon: 'pregnant_woman' },
    { value: 'paternity', label: 'Paternity Leave', icon: 'child_friendly' },
    { value: 'emergency', label: 'Emergency Leave',  icon: 'emergency' },
    { value: 'unpaid',    label: 'Unpaid Leave',    icon: 'money_off' },
    { value: 'study',     label: 'Study Leave',     icon: 'school' },
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveService,
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadBalances();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      leaveType:  ['annual', Validators.required],
      startDate:  [null, Validators.required],
      endDate:    [null, Validators.required],
      reason:     ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    });
  }

  private loadBalances(): void {
    const userId = this.authService.currentUser?.id;
    if (!userId) return;

    this.leaveService
      .getLeaveBalances(userId, new Date().getFullYear())
      .pipe(takeUntil(this.destroy$), finalize(() => (this.isLoading = false)))
      .subscribe({ next: balances => (this.balances = balances) });
  }

  getBalance(leaveType: LeaveType): LeaveBalance | undefined {
    return this.balances.find(b => b.leaveType === leaveType);
  }

  get selectedTypeBalance(): LeaveBalance | undefined {
    return this.getBalance(this.form.get('leaveType')?.value);
  }

  get totalDays(): number {
    const start: Date = this.form.get('startDate')?.value;
    const end:   Date = this.form.get('endDate')?.value;
    if (!start || !end) return 0;
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(0, diff);
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSaving) return;

    this.isSaving = true;

    this.leaveService
      .createLeaveRequest(this.form.value)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isSaving = false)),
      )
      .subscribe({
        next: () => {
          this.notification.success('Leave request submitted successfully!');
          this.router.navigate(['/leave/my-leaves']);
        },
      });
  }

  cancel(): void {
    this.router.navigate(['/leave/my-leaves']);
  }
}
