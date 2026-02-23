import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardStats, Announcement, ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http
      .get<ApiResponse<DashboardStats>>(`${this.apiUrl}/dashboard/stats`)
      .pipe(map(r => r.data));
  }

  getAnnouncements(): Observable<Announcement[]> {
    return this.http
      .get<ApiResponse<Announcement[]>>(`${this.apiUrl}/announcements`)
      .pipe(map(r => r.data));
  }
}
