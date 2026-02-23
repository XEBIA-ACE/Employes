import { Pipe, PipeTransform } from '@angular/core';

/**
 * Returns initials from a full name string.
 * Examples: "John Doe" → "JD",  "Alice" → "A"
 */
@Pipe({ name: 'initials' })
export class InitialsPipe implements PipeTransform {
  transform(name: string): string {
    if (!name?.trim()) return '?';
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join('');
  }
}
