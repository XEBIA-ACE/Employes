import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { LoggerService } from './logger.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockLoginResponse = {
    data: {
      user: {
        id: '1',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin' as const,
      },
      token: 'mock-token',
      refreshToken: 'mock-refresh-token',
      expiresIn: 86400,
    },
    timestamp: new Date().toISOString(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService, LoggerService],
    });

    service  = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start unauthenticated', () => {
    expect(service.isAuthenticated).toBeFalse();
    expect(service.currentUser).toBeNull();
  });

  it('should login successfully and store session', fakeAsync(() => {
    service.login({ email: 'admin@example.com', password: 'password123' }).subscribe(res => {
      expect(res.token).toBe('mock-token');
      expect(res.user.email).toBe('admin@example.com');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockLoginResponse);

    tick();

    expect(localStorage.getItem('ep_token')).toBe('mock-token');
    expect(service.token).toBe('mock-token');
  }));

  it('should return correct user initials', fakeAsync(() => {
    service.login({ email: 'test@test.com', password: 'pass' }).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush(mockLoginResponse);
    tick();

    expect(service.currentUser?.firstName).toBe('Admin');
  }));

  it('should detect admin role', fakeAsync(() => {
    service.login({ email: 'test@test.com', password: 'pass' }).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush(mockLoginResponse);
    tick();

    expect(service.hasRole('admin')).toBeTrue();
    expect(service.hasRole('employee')).toBeFalse();
    expect(service.hasRole(['admin', 'hr'])).toBeTrue();
  }));
});
