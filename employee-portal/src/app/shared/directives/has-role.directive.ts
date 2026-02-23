import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

/**
 * Structural directive that shows/hides content based on user role.
 *
 * Usage:
 *   <button *appHasRole="['admin', 'hr']">Delete</button>
 */
@Directive({ selector: '[appHasRole]' })
export class HasRoleDirective implements OnInit {
  @Input('appHasRole') roles: string | string[] = [];

  private hasView = false;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const allowed = Array.isArray(this.roles) ? this.roles : [this.roles];

    if (this.authService.hasRole(allowed)) {
      if (!this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      }
    } else {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
