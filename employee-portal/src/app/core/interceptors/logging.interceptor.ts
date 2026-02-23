import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LoggerService } from '../services/logger.service';

/**
 * LoggingInterceptor logs all outgoing HTTP requests and responses
 * with timing information for observability.
 */
@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  constructor(private logger: LoggerService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const startTime = Date.now();
    const reqId = this.generateId();

    this.logger.debug(`[${reqId}] → ${request.method} ${request.url}`);

    return next.handle(request).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            const duration = Date.now() - startTime;
            this.logger.debug(
              `[${reqId}] ← ${event.status} ${request.method} ${request.url} (${duration}ms)`,
            );
          }
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logger.error(
            `[${reqId}] ✗ ${error.status} ${request.method} ${request.url} (${duration}ms)`,
          );
        },
      }),
    );
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
