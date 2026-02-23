import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;

  const mockLoginResponse = {
    user: { id: '1', email: 'admin@test.com', firstName: 'Admin', lastName: 'User', role: 'admin' as const },
    token: 'token',
    refreshToken: 'refresh',
    expiresIn: 86400,
  };

  beforeEach(async () => {
    authServiceSpy    = jasmine.createSpyObj('AuthService', ['login', 'isAuthenticated'], { isAuthenticated: false });
    notificationSpy   = jasmine.createSpyObj('NotificationService', ['success', 'error']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule,
        BrowserAnimationsModule, MatSnackBarModule, MatInputModule,
        MatButtonModule, MatCheckboxModule, MatProgressSpinnerModule,
        MatIconModule, MatFormFieldModule,
      ],
      providers: [
        { provide: AuthService,       useValue: authServiceSpy },
        { provide: NotificationService, useValue: notificationSpy },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should mark form invalid when empty', () => {
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('should validate email format', () => {
    component.email.setValue('not-an-email');
    expect(component.email.hasError('email')).toBeTrue();
  });

  it('should be valid with correct credentials', () => {
    component.email.setValue('admin@test.com');
    component.password.setValue('password123');
    expect(component.loginForm.valid).toBeTrue();
  });

  it('should call authService.login on submit', fakeAsync(() => {
    authServiceSpy.login.and.returnValue(of(mockLoginResponse));

    component.email.setValue('admin@test.com');
    component.password.setValue('password123');
    component.onSubmit();
    tick();

    expect(authServiceSpy.login).toHaveBeenCalledWith(
      jasmine.objectContaining({ email: 'admin@test.com', password: 'password123' }),
    );
  }));

  it('should show error notification on failed login', fakeAsync(() => {
    authServiceSpy.login.and.returnValue(throwError(() => ({
      error: { message: 'Invalid credentials' },
    })));

    component.email.setValue('wrong@test.com');
    component.password.setValue('wrongpassword');
    component.onSubmit();
    tick();

    expect(notificationSpy.error).toHaveBeenCalled();
  }));
});
