import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiService } from './api.service';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../models/user.model';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = signal<User | null>(null);
  private token = signal<string | null>(null);

  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly isClub = computed(() => this.currentUser()?.role === 'club');
  readonly isSpectator = computed(() => this.currentUser()?.role === 'spectator');

  private api = inject(ApiService);

  constructor() {
    this.loadFromStorage();
  }

  async login(credentials: LoginRequest): Promise<User> {
    const response = await firstValueFrom(
      this.api.post<AuthResponse>('/auth/login', credentials)
    );

    this.setSession(response.data.token, response.data.user);
    return response.data.user;
  }

  async register(data: RegisterRequest): Promise<User> {
    const response = await firstValueFrom(
      this.api.post<AuthResponse>('/auth/register', data)
    );

    this.setSession(response.data.token, response.data.user);
    return response.data.user;
  }

  logout(): void {
    this.currentUser.set(null);
    this.token.set(null);
    localStorage.removeItem('sportix_token');
    localStorage.removeItem('sportix_user');
  }

  getToken(): string | null {
    return this.token();
  }

  private setSession(token: string, user: User): void {
    this.token.set(token);
    this.currentUser.set(user);
    localStorage.setItem('sportix_token', token);
    localStorage.setItem('sportix_user', JSON.stringify(user));
  }

  private loadFromStorage(): void {
    const token = localStorage.getItem('sportix_token');
    const userJson = localStorage.getItem('sportix_user');

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        this.token.set(token);
        this.currentUser.set(user);
      } catch {
        this.logout();
      }
    }
  }
}
