import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      isAuthenticated: false,
    });

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    guard  = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
  });

  const mockState = { url: '/dashboard' } as RouterStateSnapshot;
  const mockRoute = {} as ActivatedRouteSnapshot;

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should deny access when not authenticated', () => {
    Object.defineProperty(authServiceSpy, 'isAuthenticated', { get: () => false });
    const navigateSpy = spyOn(router, 'navigate');

    const result = guard.canActivate(mockRoute, mockState);

    expect(result).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(
      ['/auth/login'],
      jasmine.objectContaining({ queryParams: { returnUrl: '/dashboard' } }),
    );
  });

  it('should allow access when authenticated', () => {
    Object.defineProperty(authServiceSpy, 'isAuthenticated', { get: () => true });
    const navigateSpy = spyOn(router, 'navigate');

    const result = guard.canActivate(mockRoute, mockState);

    expect(result).toBeTrue();
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
