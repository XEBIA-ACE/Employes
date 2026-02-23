// Development environment configuration
// This file is replaced by environment.prod.ts during production build
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api/v1',
  apiTimeout: 30000,
  appName: 'Employee Portal',
  appVersion: '1.0.0',
  logLevel: 'debug',
  features: {
    payrollEnabled: true,
    leaveManagementEnabled: true,
    performanceReviewEnabled: false,
    analyticsEnabled: false,
  },
  auth: {
    tokenKey: 'employee_portal_token',
    refreshTokenKey: 'employee_portal_refresh_token',
    tokenExpiryKey: 'employee_portal_token_expiry',
  },
};
