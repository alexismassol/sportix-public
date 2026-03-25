import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { SportEvent, GlobalStats, DashboardStats, ScanResult } from '../models/event.model';
import { Observable, map } from 'rxjs';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class EventService {
  private api = inject(ApiService);

  getEvents(sport?: string, status?: string): Observable<SportEvent[]> {
    let path = '/events';
    const params: string[] = [];
    if (sport) params.push(`sport=${sport}`);
    if (status) params.push(`status=${status}`);
    if (params.length) path += '?' + params.join('&');

    return this.api.get<ApiResponse<SportEvent[]>>(path).pipe(map(r => r.data));
  }

  getEvent(id: string): Observable<SportEvent> {
    return this.api.get<ApiResponse<SportEvent>>(`/events/${id}`).pipe(map(r => r.data));
  }

  getStats(): Observable<GlobalStats> {
    return this.api.get<ApiResponse<GlobalStats>>('/stats').pipe(map(r => r.data));
  }

  getDashboard(): Observable<{ stats: DashboardStats; upcomingTickets: unknown[] }> {
    return this.api.get<ApiResponse<{ stats: DashboardStats; upcomingTickets: unknown[] }>>('/user/dashboard').pipe(map(r => r.data));
  }

  getProfile(): Observable<unknown> {
    return this.api.get<ApiResponse<unknown>>('/user/profile').pipe(map(r => r.data));
  }

  scanTicket(qrCode: string, eventId?: string): Observable<ScanResult> {
    return this.api.post<ApiResponse<ScanResult>>('/scan/ticket', { qrCode, eventId }).pipe(map(r => r.data));
  }

  scanCredit(qrCode: string, debitAmount?: number, eventId?: string): Observable<ScanResult> {
    return this.api.post<ApiResponse<ScanResult>>('/scan/credit', { qrCode, debitAmount, eventId }).pipe(map(r => r.data));
  }
}
