import { Pipe, PipeTransform } from '@angular/core';
import { EmploymentStatus } from '../../core/models/employee.model';

@Pipe({ name: 'employmentStatus' })
export class EmploymentStatusPipe implements PipeTransform {
  private readonly labels: Record<EmploymentStatus, string> = {
    active:     'Active',
    inactive:   'Inactive',
    on_leave:   'On Leave',
    terminated: 'Terminated',
  };

  transform(status: EmploymentStatus): string {
    return this.labels[status] ?? status;
  }
}
