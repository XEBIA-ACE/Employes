export type LeaveType   = 'annual' | 'sick' | 'maternity' | 'paternity' | 'unpaid' | 'emergency' | 'study';
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveBalance {
  employeeId: string;
  leaveType: LeaveType;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
  year: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    department?: string;
  };
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  approvedById?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLeaveRequest {
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  reason: string;
}

export interface ReviewLeaveRequest {
  status: 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface LeaveListParams {
  page?: number;
  pageSize?: number;
  employeeId?: string;
  leaveType?: LeaveType;
  status?: LeaveStatus;
  startDate?: Date;
  endDate?: Date;
}
