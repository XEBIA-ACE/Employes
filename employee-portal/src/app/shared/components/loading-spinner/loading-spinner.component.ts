import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="spinner-overlay" [class.inline]="inline">
      <mat-spinner [diameter]="diameter" [color]="color"></mat-spinner>
      <p *ngIf="message" class="spinner-message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .spinner-overlay {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;

      &:not(.inline) {
        position: fixed;
        inset: 0;
        background: rgba(255,255,255,0.8);
        z-index: 9999;
      }
    }

    .spinner-message {
      margin-top: 16px;
      color: rgba(0,0,0,0.54);
      font-size: 14px;
    }
  `],
})
export class LoadingSpinnerComponent {
  @Input() diameter = 48;
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() message = '';
  @Input() inline = false;
}
