import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { LoggerService } from '../services/logger.service';

/**
 * RoleGuard restricts routes to users with specific roles.
 * Requires route data to include a `roles` array.
 *
 * Usage in routing:
 * ```ts
 * {
 *   path: 'admin',
 *   canActivate: [AuthGuard, RoleGuard],
 *   data: { roles: ['admin', 'hr_manager'] }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService,
    private logger: LoggerService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredRoles: string[] = route.data['roles'] ?? [];

    if (requiredRoles.length === 0) {
      return true; // No role restriction
    }

    if (this.authService.hasAnyRole(requiredRoles)) {
      return true;
    }

    this.logger.warn(
      `Access denied for user with role '${this.authService.currentUser?.role}' ` +
        `to route requiring: [${requiredRoles.join(', ')}]`,
    );
    this.notification.error('You do not have permission to access this page.');
    this.router.navigate(['/dashboard']);
    return false;
  }
}
