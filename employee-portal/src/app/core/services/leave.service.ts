import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LeaveRequest,
  CreateLeaveRequest,
  ReviewLeaveRequest,
  LeaveBalance,
  LeaveListParams,
} from '../models/leave.model';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';

/**
 * Leave management service.
 */
@Injectable({ providedIn: 'root' })
export class LeaveService {
  private readonly apiUrl = `${environment.apiUrl}/leaves`;

  constructor(private http: HttpClient) {}

  // ---------------------------------------------------------------------------
  // Leave Requests
  // ---------------------------------------------------------------------------

  getLeaveRequests(params: LeaveListParams = {}): Observable<PaginatedResponse<LeaveRequest>> {
    const httpParams = this.buildParams(params);
    return this.http.get<PaginatedResponse<LeaveRequest>>(this.apiUrl, { params: httpParams });
  }

  getLeaveRequest(id: string): Observable<LeaveRequest> {
    return this.http
      .get<ApiResponse<LeaveRequest>>(`${this.apiUrl}/${id}`)
      .pipe(map(r => r.data));
  }

  createLeaveRequest(payload: CreateLeaveRequest): Observable<LeaveRequest> {
    return this.http
      .post<ApiResponse<LeaveRequest>>(this.apiUrl, payload)
      .pipe(map(r => r.data));
  }

  cancelLeaveRequest(id: string): Observable<LeaveRequest> {
    return this.http
      .patch<ApiResponse<LeaveRequest>>(`${this.apiUrl}/${id}/cancel`, {})
      .pipe(map(r => r.data));
  }

  reviewLeaveRequest(id: string, review: ReviewLeaveRequest): Observable<LeaveRequest> {
    return this.http
      .patch<ApiResponse<LeaveRequest>>(`${this.apiUrl}/${id}/review`, review)
      .pipe(map(r => r.data));
  }

  // ---------------------------------------------------------------------------
  // Leave Balances
  // ---------------------------------------------------------------------------

  getLeaveBalances(employeeId: string, year?: number): Observable<LeaveBalance[]> {
    let params = new HttpParams().set('employeeId', employeeId);
    if (year) params = params.set('year', year);
    return this.http
      .get<ApiResponse<LeaveBalance[]>>(`${environment.apiUrl}/leave-balances`, { params })
      .pipe(map(r => r.data));
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private buildParams(filters: LeaveListParams): HttpParams {
    let p = new HttpParams();
    if (filters.page        != null) p = p.set('page', filters.page);
    if (filters.pageSize    != null) p = p.set('pageSize', filters.pageSize);
    if (filters.employeeId)          p = p.set('employeeId', filters.employeeId);
    if (filters.leaveType)           p = p.set('leaveType', filters.leaveType);
    if (filters.status)              p = p.set('status', filters.status);
    if (filters.startDate)           p = p.set('startDate', filters.startDate.toISOString());
    if (filters.endDate)             p = p.set('endDate', filters.endDate.toISOString());
    return p;
  }
}
