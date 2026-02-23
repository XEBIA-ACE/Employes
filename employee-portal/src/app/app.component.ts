import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { AppState } from './store/app.state';
import { selectIsAuthenticated } from './store/auth/auth.selectors';
import { LoggerService } from './core/services/logger.service';

/**
 * Root application component.
 * Handles global layout and navigation state.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Employee Portal';
  isLoading = false;
  isAuthenticated = false;

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private logger: LoggerService,
  ) {}

  ngOnInit(): void {
    // Subscribe to auth state
    this.store
      .select(selectIsAuthenticated)
      .pipe(takeUntil(this.destroy$))
      .subscribe((authenticated) => {
        this.isAuthenticated = authenticated;
      });

    // Track navigation for loading state and logging
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter(
          (event) =>
            event instanceof NavigationStart || event instanceof NavigationEnd,
        ),
      )
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.isLoading = true;
        } else if (event instanceof NavigationEnd) {
          this.isLoading = false;
          this.logger.debug(`Navigated to: ${event.urlAfterRedirects}`);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
