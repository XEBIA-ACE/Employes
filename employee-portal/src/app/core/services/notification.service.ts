import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * Notification service wrapping Angular Material SnackBar
 * for consistent app-wide toast notifications.
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly defaultDuration = 4000;

  constructor(private snackBar: MatSnackBar) {}

  success(message: string, duration = this.defaultDuration): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 6000): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration = this.defaultDuration): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration = this.defaultDuration): void {
    this.show(message, 'info', duration);
  }

  private show(message: string, type: NotificationType, duration: number): void {
    const config: MatSnackBarConfig = {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [`${type}-snackbar`],
    };

    this.snackBar.open(message, 'Dismiss', config);
  }
}
