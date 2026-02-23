import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { LeaveRequest } from '../../features/leave-management/models/leave.model';
import * as LeaveActions from './leave.actions';

export interface LeaveState extends EntityState<LeaveRequest> {
  isLoading: boolean;
  error: string | null;
  total: number;
  leaveBalance: LeaveBalance | null;
}

export interface LeaveBalance {
  annual: { total: number; used: number; remaining: number };
  sick: { total: number; used: number; remaining: number };
  personal: { total: number; used: number; remaining: number };
}

const adapter: EntityAdapter<LeaveRequest> = createEntityAdapter<LeaveRequest>({
  selectId: (request) => request.id,
  sortComparer: (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
});

const initialState: LeaveState = adapter.getInitialState({
  isLoading: false,
  error: null,
  total: 0,
  leaveBalance: null,
});

export const leaveReducer = createReducer(
  initialState,

  on(LeaveActions.loadLeaveRequests, (state) => ({ ...state, isLoading: true, error: null })),

  on(LeaveActions.loadLeaveRequestsSuccess, (state, { requests, total }) =>
    adapter.setAll(requests, { ...state, isLoading: false, total }),
  ),

  on(LeaveActions.loadLeaveRequestsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(LeaveActions.submitLeaveRequestSuccess, (state, { request }) =>
    adapter.addOne(request, { ...state, total: state.total + 1 }),
  ),

  on(LeaveActions.approveLeaveRequestSuccess, (state, { request }) =>
    adapter.updateOne({ id: request.id, changes: request }, state),
  ),

  on(LeaveActions.rejectLeaveRequestSuccess, (state, { request }) =>
    adapter.updateOne({ id: request.id, changes: request }, state),
  ),

  on(LeaveActions.cancelLeaveRequestSuccess, (state, { id }) =>
    adapter.removeOne(id, { ...state, total: state.total - 1 }),
  ),

  on(LeaveActions.loadLeaveBalanceSuccess, (state, { balance }) => ({
    ...state,
    leaveBalance: balance,
  })),
);

export const { selectAll: selectAllLeaveRequests } = adapter.getSelectors();
