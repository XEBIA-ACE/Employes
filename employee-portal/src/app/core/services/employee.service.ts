import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeListParams,
  Department,
  Position,
} from '../models/employee.model';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';

/**
 * Employee management service.
 * All methods communicate with the REST API and return typed Observables.
 */
@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly apiUrl = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) {}

  // ---------------------------------------------------------------------------
  // Employees
  // ---------------------------------------------------------------------------

  getEmployees(params: EmployeeListParams = {}): Observable<PaginatedResponse<Employee>> {
    const httpParams = this.buildParams(params);
    return this.http.get<PaginatedResponse<Employee>>(this.apiUrl, { params: httpParams });
  }

  getEmployee(id: string): Observable<Employee> {
    return this.http
      .get<ApiResponse<Employee>>(`${this.apiUrl}/${id}`)
      .pipe(map(r => r.data));
  }

  createEmployee(payload: CreateEmployeeRequest): Observable<Employee> {
    return this.http
      .post<ApiResponse<Employee>>(this.apiUrl, payload)
      .pipe(map(r => r.data));
  }

  updateEmployee(id: string, payload: UpdateEmployeeRequest): Observable<Employee> {
    return this.http
      .patch<ApiResponse<Employee>>(`${this.apiUrl}/${id}`, payload)
      .pipe(map(r => r.data));
  }

  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadAvatar(id: string, file: File): Observable<{ avatarUrl: string }> {
    const form = new FormData();
    form.append('avatar', file);
    return this.http
      .post<ApiResponse<{ avatarUrl: string }>>(`${this.apiUrl}/${id}/avatar`, form)
      .pipe(map(r => r.data));
  }

  // ---------------------------------------------------------------------------
  // Departments
  // ---------------------------------------------------------------------------

  getDepartments(): Observable<Department[]> {
    return this.http
      .get<ApiResponse<Department[]>>(`${environment.apiUrl}/departments`)
      .pipe(map(r => r.data));
  }

  // ---------------------------------------------------------------------------
  // Positions
  // ---------------------------------------------------------------------------

  getPositions(departmentId?: string): Observable<Position[]> {
    const params = departmentId ? new HttpParams().set('departmentId', departmentId) : undefined;
    return this.http
      .get<ApiResponse<Position[]>>(`${environment.apiUrl}/positions`, { params })
      .pipe(map(r => r.data));
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private buildParams(filters: EmployeeListParams): HttpParams {
    let p = new HttpParams();
    if (filters.page      != null) p = p.set('page', filters.page);
    if (filters.pageSize  != null) p = p.set('pageSize', filters.pageSize);
    if (filters.search)            p = p.set('search', filters.search);
    if (filters.departmentId)      p = p.set('departmentId', filters.departmentId);
    if (filters.status)            p = p.set('status', filters.status);
    if (filters.sortBy)            p = p.set('sortBy', filters.sortBy);
    if (filters.sortDir)           p = p.set('sortDir', filters.sortDir);
    return p;
  }
}
