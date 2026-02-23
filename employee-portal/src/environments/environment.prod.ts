export const environment = {
  production: true,
  apiUrl: '/api/v1',
  appName: 'Employee Portal',
  version: '1.0.0',
  features: {
    leaveManagement: true,
    announcements: true,
    performanceReview: false,
  },
  logging: {
    level: 'error',
    enableConsole: false,
  },
};
