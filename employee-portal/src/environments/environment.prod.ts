// Production environment configuration
export const environment = {
  production: true,
  apiBaseUrl: '/api/v1', // Relative URL — nginx proxies to backend
  apiTimeout: 30000,
  appName: 'Employee Portal',
  appVersion: '1.0.0',
  logLevel: 'error',
  features: {
    payrollEnabled: true,
    leaveManagementEnabled: true,
    performanceReviewEnabled: false,
    analyticsEnabled: true,
  },
  auth: {
    tokenKey: 'employee_portal_token',
    refreshTokenKey: 'employee_portal_refresh_token',
    tokenExpiryKey: 'employee_portal_token_expiry',
  },
};
