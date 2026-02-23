import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

export interface NavItem {
  label: string;
  icon: string;
  route?: string;
  roles?: string[];
  children?: NavItem[];
  badge?: string | number;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Input() isOpen = true;

  currentUser: User | null = null;
  currentUrl  = '';

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
      roles: ['admin', 'hr', 'manager'],
    },
    {
      label: 'Leave Management',
      icon: 'event_busy',
      children: [
        { label: 'My Leaves', icon: 'beach_access', route: '/leave/my-leaves' },
        { label: 'Request Leave', icon: 'add_circle', route: '/leave/request' },
        { label: 'Leave Approvals', icon: 'task_alt', route: '/leave/approvals', roles: ['admin', 'hr', 'manager'] },
      ],
    },
    {
      label: 'My Profile',
      icon: 'person',
      route: '/profile',
    },
    {
      label: 'Announcements',
      icon: 'campaign',
      route: '/announcements',
    },
    {
      label: 'Administration',
      icon: 'admin_panel_settings',
      roles: ['admin', 'hr'],
      children: [
        { label: 'Departments', icon: 'business', route: '/admin/departments' },
        { label: 'Positions', icon: 'work', route: '/admin/positions' },
        { label: 'Settings', icon: 'settings', route: '/admin/settings' },
      ],
    },
  ];

  expandedItems = new Set<string>();

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => (this.currentUser = user));
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(e => (this.currentUrl = (e as NavigationEnd).urlAfterRedirects));
    this.currentUrl = this.router.url;
  }

  isVisible(item: NavItem): boolean {
    if (!item.roles || item.roles.length === 0) return true;
    return this.authService.hasRole(item.roles);
  }

  isActive(item: NavItem): boolean {
    if (item.route) return this.currentUrl.startsWith(item.route);
    return item.children?.some(c => c.route && this.currentUrl.startsWith(c.route)) ?? false;
  }

  toggleExpand(label: string): void {
    this.expandedItems.has(label)
      ? this.expandedItems.delete(label)
      : this.expandedItems.add(label);
  }

  isExpanded(label: string): boolean {
    return this.expandedItems.has(label);
  }
}
