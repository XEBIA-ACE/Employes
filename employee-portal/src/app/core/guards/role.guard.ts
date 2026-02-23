import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

/**
 * Role-based access control guard.
 * Routes annotated with `data.roles` restrict access to those roles only.
 *
 * Usage in routing:
 *   {
 *     path: 'admin',
 *     canActivate: [AuthGuard, RoleGuard],
 *     data: { roles: ['admin', 'hr'] },
 *   }
 */
@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles: string[] = route.data['roles'] ?? [];

    if (requiredRoles.length === 0) return true;

    if (this.authService.hasRole(requiredRoles)) return true;

    this.notification.error('You do not have permission to access this page.');
    this.router.navigate(['/dashboard']);
    return false;
  }
}
