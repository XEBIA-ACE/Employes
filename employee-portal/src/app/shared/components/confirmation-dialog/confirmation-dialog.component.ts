import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warn' | 'info';
}

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <div class="confirm-dialog">
      <div class="confirm-header" [ngClass]="data.type || 'info'">
        <mat-icon>{{ icon }}</mat-icon>
        <h2>{{ data.title }}</h2>
      </div>

      <mat-dialog-content class="confirm-body">
        <p>{{ data.message }}</p>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-stroked-button [mat-dialog-close]="false">
          {{ data.cancelText || 'Cancel' }}
        </button>
        <button
          mat-raised-button
          [color]="actionColor"
          [mat-dialog-close]="true"
          cdkFocusInitial
        >
          {{ data.confirmText || 'Confirm' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirm-dialog { min-width: 360px; }

    .confirm-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 24px 16px;

      h2 { margin: 0; font-size: 18px; }

      mat-icon { font-size: 28px; width: 28px; height: 28px; }

      &.danger { color: #c62828; }
      &.warn   { color: #e65100; }
      &.info   { color: #1565c0; }
    }

    .confirm-body { padding: 0 24px 16px; }

    mat-dialog-actions { padding: 0 24px 20px; gap: 8px; }
  `],
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData,
  ) {}

  get icon(): string {
    switch (this.data.type) {
      case 'danger': return 'delete_forever';
      case 'warn':   return 'warning';
      default:       return 'info';
    }
  }

  get actionColor(): string {
    return this.data.type === 'danger' ? 'warn' : 'primary';
  }
}
