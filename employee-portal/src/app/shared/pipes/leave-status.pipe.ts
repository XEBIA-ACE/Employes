import { Pipe, PipeTransform } from '@angular/core';
import { LeaveStatus } from '../../core/models/leave.model';

/** Maps leave status codes to human-readable labels. */
@Pipe({ name: 'leaveStatus' })
export class LeaveStatusPipe implements PipeTransform {
  private readonly labels: Record<LeaveStatus, string> = {
    pending:   'Pending',
    approved:  'Approved',
    rejected:  'Rejected',
    cancelled: 'Cancelled',
  };

  transform(status: LeaveStatus): string {
    return this.labels[status] ?? status;
  }
}
