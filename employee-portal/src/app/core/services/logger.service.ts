import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * Structured logging service with configurable log levels.
 * In production, logs are filtered to `error` level only.
 * Extend this service to send logs to a remote aggregator (e.g., Datadog, Splunk).
 */
@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private readonly appName = environment.appName;
  private readonly minLevel: LogLevel = environment.logLevel as LogLevel;

  debug(message: string, ...args: unknown[]): void {
    this.log('debug', message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this.log('error', message, ...args);
  }

  private log(level: LogLevel, message: string, ...args: unknown[]): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry = {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      app: this.appName,
      message,
      ...(args.length > 0 && { details: args }),
    };

    switch (level) {
      case 'debug':
        console.debug(`[${entry.level}] ${entry.timestamp} ${entry.message}`, ...args);
        break;
      case 'info':
        console.info(`[${entry.level}] ${entry.timestamp} ${entry.message}`, ...args);
        break;
      case 'warn':
        console.warn(`[${entry.level}] ${entry.timestamp} ${entry.message}`, ...args);
        break;
      case 'error':
        console.error(`[${entry.level}] ${entry.timestamp} ${entry.message}`, ...args);
        // In production, send to remote logging service
        if (environment.production) {
          this.sendToRemote(entry);
        }
        break;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[this.minLevel];
  }

  /**
   * Placeholder for sending logs to a remote aggregation service.
   * Replace with actual implementation (e.g., Datadog, Sentry, custom endpoint).
   */
  private sendToRemote(entry: Record<string, unknown>): void {
    // TODO: Implement remote logging
    // Example: this.http.post('/api/logs', entry).subscribe();
  }
}
