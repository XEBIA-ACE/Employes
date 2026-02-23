import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '../models/employee.model';
import { ApiResponse, PaginatedResponse, QueryParams } from '../../../core/models/api-response.model';

/**
 * EmployeeService handles all CRUD operations for employees.
 * Communicates with the REST API and returns typed observables.
 */
@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly apiUrl = `${environment.apiBaseUrl}/employees`;

  constructor(private http: HttpClient) {}

  /**
   * Fetches paginated list of employees with optional filters.
   */
  getEmployees(params?: QueryParams): Observable<PaginatedResponse<Employee>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    return this.http.get<PaginatedResponse<Employee>>(this.apiUrl, { params: httpParams });
  }

  /**
   * Fetches a single employee by ID.
   */
  getEmployeeById(id: string): Observable<ApiResponse<Employee>> {
    return this.http.get<ApiResponse<Employee>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Creates a new employee record.
   */
  createEmployee(employee: CreateEmployeeDto): Observable<ApiResponse<Employee>> {
    return this.http.post<ApiResponse<Employee>>(this.apiUrl, employee);
  }

  /**
   * Updates an existing employee record.
   */
  updateEmployee(id: string, employee: UpdateEmployeeDto): Observable<ApiResponse<Employee>> {
    return this.http.patch<ApiResponse<Employee>>(`${this.apiUrl}/${id}`, employee);
  }

  /**
   * Soft-deletes an employee (marks as terminated).
   */
  deleteEmployee(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Uploads or replaces an employee's profile photo.
   */
  uploadAvatar(id: string, file: File): Observable<ApiResponse<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post<ApiResponse<{ avatarUrl: string }>>(
      `${this.apiUrl}/${id}/avatar`,
      formData,
    );
  }

  /**
   * Exports the employee list as CSV.
   */
  exportCsv(params?: QueryParams): Observable<Blob> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    return this.http.get(`${this.apiUrl}/export/csv`, {
      params: httpParams,
      responseType: 'blob',
    });
  }
}
