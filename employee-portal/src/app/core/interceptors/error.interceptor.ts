import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NotificationService } from '../services/notification.service';
import { LoggerService } from '../services/logger.service';

/**
 * ErrorInterceptor provides centralized HTTP error handling.
 * Transforms API errors into user-friendly notifications and
 * re-throws the error so individual components can handle specifics.
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private notification: NotificationService,
    private logger: LoggerService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.logger.error(`HTTP Error ${error.status}: ${request.url}`, error);

        let userMessage = 'An unexpected error occurred. Please try again.';

        if (error.error instanceof ErrorEvent) {
          // Client-side / network error
          userMessage = `Network error: ${error.error.message}`;
        } else {
          // Server-side error
          switch (error.status) {
            case 400:
              userMessage = error.error?.message || 'Invalid request. Please check your input.';
              break;
            case 401:
              // Handled by AuthInterceptor — silent here
              return throwError(() => error);
            case 403:
              userMessage = 'You do not have permission to perform this action.';
              break;
            case 404:
              userMessage = 'The requested resource was not found.';
              break;
            case 409:
              userMessage = error.error?.message || 'Conflict: resource already exists.';
              break;
            case 422:
              userMessage = error.error?.message || 'Validation failed. Please check your input.';
              break;
            case 429:
              userMessage = 'Too many requests. Please slow down and try again.';
              break;
            case 500:
            case 502:
            case 503:
              userMessage = 'Server error. Our team has been notified. Please try again later.';
              break;
            case 0:
              userMessage = 'Cannot connect to the server. Check your network connection.';
              break;
          }
        }

        this.notification.error(userMessage);
        return throwError(() => error);
      }),
    );
  }
}
