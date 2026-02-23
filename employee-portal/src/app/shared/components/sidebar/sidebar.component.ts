import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { AppState } from '../../../store/app.state';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { User } from '../../../core/models/user.model';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
  children?: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isCollapsed = false;
  activeRoute = '';

  readonly navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
    },
    {
      label: 'Employees',
      icon: 'people',
      route: '/employees',
      roles: ['admin', 'hr_manager'],
    },
    {
      label: 'Leave Management',
      icon: 'event_busy',
      route: '/leave',
    },
    {
      label: 'Payroll',
      icon: 'payments',
      route: '/payroll',
    },
    {
      label: 'My Profile',
      icon: 'account_circle',
      route: '/profile',
    },
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.store
      .select(selectCurrentUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => (this.currentUser = user));

    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter((event) => event instanceof NavigationEnd),
      )
      .subscribe((event) => {
        this.activeRoute = (event as NavigationEnd).urlAfterRedirects;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  isActive(route: string): boolean {
    return this.activeRoute.startsWith(route);
  }

  canAccessItem(item: NavItem): boolean {
    if (!item.roles || item.roles.length === 0) {
      return true;
    }
    if (!this.currentUser) {
      return false;
    }
    return item.roles.some(
      (role) => this.currentUser!.role === role || this.currentUser!.roles.includes(role as any),
    );
  }

  get visibleNavItems(): NavItem[] {
    return this.navItems.filter((item) => this.canAccessItem(item));
  }
}
