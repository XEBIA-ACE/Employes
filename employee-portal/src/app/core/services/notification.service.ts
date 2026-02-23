import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export type NotificationType = 'success' | 'error' | 'info' | 'warn';

/**
 * Centralised notification service using Angular Material Snackbar.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly defaults: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'end',
    verticalPosition: 'top',
  };

  constructor(private snackBar: MatSnackBar) {}

  success(message: string, action = 'Close'): void {
    this.show(message, action, 'snackbar-success');
  }

  error(message: string, action = 'Close', duration = 6000): void {
    this.show(message, action, 'snackbar-error', duration);
  }

  info(message: string, action = 'Close'): void {
    this.show(message, action, 'snackbar-info');
  }

  warn(message: string, action = 'Close'): void {
    this.show(message, action, 'snackbar-warn', 5000);
  }

  private show(
    message: string,
    action: string,
    panelClass: string,
    duration?: number,
  ): void {
    this.snackBar.open(message, action, {
      ...this.defaults,
      ...(duration ? { duration } : {}),
      panelClass: [panelClass],
    });
  }
}
