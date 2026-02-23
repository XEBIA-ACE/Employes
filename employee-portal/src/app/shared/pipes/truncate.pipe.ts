import { Pipe, PipeTransform } from '@angular/core';

/**
 * Truncates text to a specified length and appends an ellipsis.
 *
 * Usage:
 * ```html
 * {{ 'A very long description here' | truncate:30 }}
 * {{ 'A very long description here' | truncate:30:'...' }}
 * ```
 */
@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, limit = 100, ellipsis = '…'): string {
    if (!value) {
      return '';
    }
    if (value.length <= limit) {
      return value;
    }
    return value.substring(0, limit).trimEnd() + ellipsis;
  }
}
