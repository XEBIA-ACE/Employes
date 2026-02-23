import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
}

/**
 * Structured logging service.
 * In production only warn/error levels are emitted.
 * Extend to ship logs to a remote service (e.g. Datadog, Sentry).
 */
@Injectable({ providedIn: 'root' })
export class LoggerService {
  private readonly levels: Record<LogLevel, number> = {
    debug: 0,
    info:  1,
    warn:  2,
    error: 3,
  };

  private get minLevel(): number {
    return this.levels[environment.logging.level as LogLevel] ?? 1;
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.log('error', message, context);
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    if (this.levels[level] < this.minLevel) return;

    const entry: LogEntry = {
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
    };

    if (!environment.logging.enableConsole) return;

    const formatted = `[${entry.timestamp}] [${level.toUpperCase()}] ${message}`;

    switch (level) {
      case 'debug': console.debug(formatted, context ?? ''); break;
      case 'info':  console.info(formatted, context ?? '');  break;
      case 'warn':  console.warn(formatted, context ?? '');  break;
      case 'error': console.error(formatted, context ?? ''); break;
    }
  }
}
