/**
 * Standard API response wrapper for all backend responses.
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp: string;
}

/**
 * Paginated response wrapper.
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
  message?: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Standard error response from the API.
 */
export interface ApiError {
  statusCode: number;
  message: string;
  errors?: ValidationError[];
  timestamp: string;
  path: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

/**
 * Health check response.
 */
export interface HealthResponse {
  status: 'ok' | 'degraded' | 'down';
  version: string;
  timestamp: string;
  services: Record<string, 'ok' | 'down'>;
}

/**
 * Dashboard summary statistics.
 */
export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveToday: number;
  newHiresThisMonth: number;
  pendingLeaveRequests: number;
  upcomingBirthdays: Array<{
    employeeId: string;
    name: string;
    date: string;
    avatar?: string;
  }>;
  departmentBreakdown: Array<{
    department: string;
    count: number;
  }>;
  leaveTypeSummary: Array<{
    leaveType: string;
    count: number;
  }>;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'leave_request' | 'new_employee' | 'leave_approved' | 'leave_rejected' | 'profile_update';
  description: string;
  actor: string;
  timestamp: Date;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  publishedAt: Date;
  expiresAt?: Date;
  authorId: string;
  author?: string;
}
