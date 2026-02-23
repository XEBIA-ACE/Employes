export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1',
  appName: 'Employee Portal',
  version: '1.0.0',
  features: {
    leaveManagement: true,
    announcements: true,
    performanceReview: false,
  },
  logging: {
    level: 'debug',
    enableConsole: true,
  },
};
