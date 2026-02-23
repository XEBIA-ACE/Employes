import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { LeaveRequest, SubmitLeaveRequestDto } from '../models/leave.model';
import { ApiResponse, PaginatedResponse } from '../../../core/models/api-response.model';
import { LeaveBalance } from '../../../store/leave/leave.reducer';

@Injectable({ providedIn: 'root' })
export class LeaveService {
  private readonly apiUrl = `${environment.apiBaseUrl}/leave`;

  constructor(private http: HttpClient) {}

  getLeaveRequests(): Observable<PaginatedResponse<LeaveRequest>> {
    return this.http.get<PaginatedResponse<LeaveRequest>>(this.apiUrl);
  }

  getLeaveBalance(): Observable<ApiResponse<LeaveBalance>> {
    return this.http.get<ApiResponse<LeaveBalance>>(`${this.apiUrl}/balance`);
  }

  submitLeaveRequest(request: SubmitLeaveRequestDto): Observable<ApiResponse<LeaveRequest>> {
    return this.http.post<ApiResponse<LeaveRequest>>(this.apiUrl, request);
  }

  approveLeaveRequest(id: string, comment?: string): Observable<ApiResponse<LeaveRequest>> {
    return this.http.post<ApiResponse<LeaveRequest>>(`${this.apiUrl}/${id}/approve`, { comment });
  }

  rejectLeaveRequest(id: string, reason: string): Observable<ApiResponse<LeaveRequest>> {
    return this.http.post<ApiResponse<LeaveRequest>>(`${this.apiUrl}/${id}/reject`, { reason });
  }

  cancelLeaveRequest(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
