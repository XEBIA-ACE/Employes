import { createAction, props } from '@ngrx/store';
import {
  LeaveRequest,
  SubmitLeaveRequestDto,
} from '../../features/leave-management/models/leave.model';
import { LeaveBalance } from './leave.reducer';

export const loadLeaveRequests = createAction('[Leave] Load Leave Requests');

export const loadLeaveRequestsSuccess = createAction(
  '[Leave] Load Leave Requests Success',
  props<{ requests: LeaveRequest[]; total: number }>(),
);

export const loadLeaveRequestsFailure = createAction(
  '[Leave] Load Leave Requests Failure',
  props<{ error: string }>(),
);

export const submitLeaveRequest = createAction(
  '[Leave] Submit Leave Request',
  props<{ request: SubmitLeaveRequestDto }>(),
);

export const submitLeaveRequestSuccess = createAction(
  '[Leave] Submit Leave Request Success',
  props<{ request: LeaveRequest }>(),
);

export const submitLeaveRequestFailure = createAction(
  '[Leave] Submit Leave Request Failure',
  props<{ error: string }>(),
);

export const approveLeaveRequest = createAction(
  '[Leave] Approve Leave Request',
  props<{ id: string; comment?: string }>(),
);

export const approveLeaveRequestSuccess = createAction(
  '[Leave] Approve Leave Request Success',
  props<{ request: LeaveRequest }>(),
);

export const rejectLeaveRequest = createAction(
  '[Leave] Reject Leave Request',
  props<{ id: string; reason: string }>(),
);

export const rejectLeaveRequestSuccess = createAction(
  '[Leave] Reject Leave Request Success',
  props<{ request: LeaveRequest }>(),
);

export const cancelLeaveRequest = createAction(
  '[Leave] Cancel Leave Request',
  props<{ id: string }>(),
);

export const cancelLeaveRequestSuccess = createAction(
  '[Leave] Cancel Leave Request Success',
  props<{ id: string }>(),
);

export const loadLeaveBalance = createAction('[Leave] Load Leave Balance');

export const loadLeaveBalanceSuccess = createAction(
  '[Leave] Load Leave Balance Success',
  props<{ balance: LeaveBalance }>(),
);
