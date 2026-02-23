import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, catchError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { LoggerService } from '../services/logger.service';

/**
 * Global HTTP error handler.
 * Maps HTTP status codes to user-friendly snackbar messages.
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private notification: NotificationService,
    private logger: LoggerService,
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        // 401 is handled by AuthInterceptor; skip here
        if (err.status === 401) return throwError(() => err);

        const message = this.resolveMessage(err);
        this.logger.error('API error', { url: req.url, status: err.status, message });
        this.notification.error(message);

        return throwError(() => err);
      }),
    );
  }

  private resolveMessage(err: HttpErrorResponse): string {
    // Prefer server-provided message
    const serverMsg: string | undefined = err.error?.message;
    if (serverMsg) return serverMsg;

    switch (err.status) {
      case 400: return 'Invalid request. Please check your input.';
      case 403: return 'You do not have permission to perform this action.';
      case 404: return 'The requested resource was not found.';
      case 409: return 'A conflict occurred. The resource may already exist.';
      case 422: return 'Validation failed. Please review the form.';
      case 429: return 'Too many requests. Please wait a moment and try again.';
      case 500: return 'An internal server error occurred. Please try again later.';
      case 503: return 'Service temporarily unavailable. Please try again shortly.';
      case 0:   return 'Unable to connect to the server. Check your network connection.';
      default:  return 'An unexpected error occurred.';
    }
  }
}
