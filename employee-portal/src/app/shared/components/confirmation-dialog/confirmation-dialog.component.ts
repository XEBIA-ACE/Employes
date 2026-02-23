import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

/**
 * Reusable confirmation dialog for destructive or important actions.
 *
 * Usage:
 * ```ts
 * const ref = this.dialog.open(ConfirmationDialogComponent, {
 *   data: {
 *     title: 'Delete Employee',
 *     message: 'Are you sure you want to delete this employee? This action cannot be undone.',
 *     confirmText: 'Delete',
 *     isDanger: true,
 *   }
 * });
 * ref.afterClosed().subscribe(confirmed => { if (confirmed) { ... } });
 * ```
 */
@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData,
  ) {}

  get confirmText(): string {
    return this.data.confirmText ?? 'Confirm';
  }

  get cancelText(): string {
    return this.data.cancelText ?? 'Cancel';
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
