import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, finalize } from 'rxjs';
import { LoggerService } from '../services/logger.service';

/**
 * Logs HTTP request/response details for observability.
 */
@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  constructor(private logger: LoggerService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const started = Date.now();

    this.logger.debug(`HTTP → ${req.method} ${req.url}`);

    return next.handle(req).pipe(
      tap({
        next: event => {
          if (event instanceof HttpResponse) {
            const elapsed = Date.now() - started;
            this.logger.debug(`HTTP ← ${req.method} ${req.url}`, {
              status: event.status,
              elapsed: `${elapsed}ms`,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          const elapsed = Date.now() - started;
          this.logger.error(`HTTP ✗ ${req.method} ${req.url}`, {
            status: err.status,
            message: err.message,
            elapsed: `${elapsed}ms`,
          });
        },
      }),
      finalize(() => {
        // Could emit metrics here (e.g., to a monitoring service)
      }),
    );
  }
}
