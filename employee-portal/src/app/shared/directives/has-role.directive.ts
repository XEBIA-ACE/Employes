import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppState } from '../../store/app.state';
import { selectCurrentUser } from '../../store/auth/auth.selectors';
import { User } from '../../core/models/user.model';

/**
 * Structural directive that conditionally renders elements based on user roles.
 *
 * Usage:
 * ```html
 * <!-- Show only to admins and HR managers -->
 * <button *appHasRole="['admin', 'hr_manager']">Delete Employee</button>
 *
 * <!-- Show only to single role -->
 * <div *appHasRole="'admin'">Admin Panel</div>
 * ```
 */
@Directive({
  selector: '[appHasRole]',
})
export class HasRoleDirective implements OnInit, OnDestroy {
  private requiredRoles: string[] = [];
  private currentUser: User | null = null;
  private hasView = false;
  private destroy$ = new Subject<void>();

  @Input()
  set appHasRole(roles: string | string[]) {
    this.requiredRoles = Array.isArray(roles) ? roles : [roles];
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    this.store
      .select(selectCurrentUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUser = user;
        this.updateView();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateView(): void {
    const hasAccess = this.checkAccess();

    if (hasAccess && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasAccess && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }

  private checkAccess(): boolean {
    if (!this.currentUser || this.requiredRoles.length === 0) {
      return false;
    }
    return this.requiredRoles.some(
      (role) =>
        this.currentUser!.role === role || this.currentUser!.roles.includes(role as any),
    );
  }
}
