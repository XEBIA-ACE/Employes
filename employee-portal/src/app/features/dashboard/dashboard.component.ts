import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil, forkJoin, finalize } from 'rxjs';
import { DashboardService } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { DashboardStats, Announcement } from '../../core/models/api-response.model';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStats | null = null;
  announcements: Announcement[] = [];
  currentUser: User | null = null;
  isLoading = true;

  private destroy$ = new Subject<void>();

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  private loadData(): void {
    this.isLoading = true;

    forkJoin({
      stats:         this.dashboardService.getStats(),
      announcements: this.dashboardService.getAnnouncements(),
    })
    .pipe(
      takeUntil(this.destroy$),
      finalize(() => (this.isLoading = false)),
    )
    .subscribe({
      next: ({ stats, announcements }) => {
        this.stats         = stats;
        this.announcements = announcements;
      },
    });
  }

  refresh(): void {
    this.loadData();
  }

  priorityColor(priority: string): string {
    const map: Record<string, string> = {
      high:   'warn',
      medium: 'accent',
      low:    'primary',
    };
    return map[priority] ?? 'primary';
  }
}
