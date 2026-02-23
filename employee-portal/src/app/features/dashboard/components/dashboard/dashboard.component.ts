import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppState } from '../../../../store/app.state';
import { selectCurrentUser } from '../../../../store/auth/auth.selectors';
import { User } from '../../../../core/models/user.model';
import { loadEmployees } from '../../../../store/employees/employees.actions';
import { selectEmployeesTotal } from '../../../../store/employees/employees.selectors';

export interface StatCard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  totalEmployees = 0;

  statCards: StatCard[] = [
    {
      title: 'Total Employees',
      value: 0,
      icon: 'people',
      color: '#3f51b5',
      change: '+3 this month',
      changeType: 'positive',
    },
    {
      title: 'On Leave Today',
      value: 5,
      icon: 'event_busy',
      color: '#ff9800',
      change: '2 pending approval',
      changeType: 'neutral',
    },
    {
      title: 'Open Positions',
      value: 8,
      icon: 'work_outline',
      color: '#9c27b0',
      change: '3 new this week',
      changeType: 'positive',
    },
    {
      title: 'Payroll (This Month)',
      value: '$284,500',
      icon: 'payments',
      color: '#4caf50',
      change: '+2.1% vs last month',
      changeType: 'neutral',
    },
  ];

  recentActivities = [
    { type: 'employee_added', message: 'New employee Jane Smith joined Engineering', time: '2 hours ago', icon: 'person_add' },
    { type: 'leave_approved', message: 'Leave request for John Doe approved', time: '4 hours ago', icon: 'event_available' },
    { type: 'payroll_processed', message: 'March payroll processed successfully', time: '1 day ago', icon: 'payments' },
    { type: 'employee_updated', message: 'Profile updated for Robert Johnson', time: '2 days ago', icon: 'edit' },
    { type: 'leave_requested', message: 'Leave request submitted by Alice Chen', time: '3 days ago', icon: 'event_busy' },
  ];

  private destroy$ = new Subject<void>();

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.select(selectCurrentUser).pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.currentUser = user;
    });

    this.store.dispatch(loadEmployees({ params: { page: 1, limit: 1 } }));

    this.store.select(selectEmployeesTotal).pipe(takeUntil(this.destroy$)).subscribe((total) => {
      this.totalEmployees = total;
      this.statCards[0].value = total;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good morning';
    }
    if (hour < 17) {
      return 'Good afternoon';
    }
    return 'Good evening';
  }
}
