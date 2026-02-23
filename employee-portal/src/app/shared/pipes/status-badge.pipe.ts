import { Pipe, PipeTransform } from '@angular/core';

/**
 * Maps a status string to a CSS class for the .badge component.
 *
 * Usage:
 * ```html
 * <span class="badge" [class]="'badge-' + (status | statusBadge)">{{ status }}</span>
 * ```
 */
@Pipe({
  name: 'statusBadge',
})
export class StatusBadgePipe implements PipeTransform {
  private readonly STATUS_MAP: Record<string, string> = {
    // Employee statuses
    active: 'success',
    inactive: 'default',
    terminated: 'danger',
    on_leave: 'warning',

    // Leave statuses
    approved: 'success',
    pending: 'warning',
    rejected: 'danger',
    cancelled: 'default',

    // Payroll statuses
    paid: 'success',
    processing: 'info',
    failed: 'danger',

    // Generic
    success: 'success',
    error: 'danger',
    warning: 'warning',
    info: 'info',
  };

  transform(status: string | null | undefined): string {
    if (!status) {
      return 'default';
    }
    return this.STATUS_MAP[status.toLowerCase()] ?? 'default';
  }
}
