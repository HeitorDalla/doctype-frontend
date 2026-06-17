import { Injectable } from '@angular/core';

import { ApiService } from './api.service';
import { AuthResponse } from './models';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly tokenKey = 'doctypeToken';
  private readonly userKey = 'doctypeUser';

  constructor(private readonly api: ApiService) {}

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  get user(): AuthResponse | null {
    const raw = localStorage.getItem(this.userKey);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthResponse;
    } catch {
      return null;
    }
  }

  get currentUserName(): string {
    return this.user?.nome || 'Usuario';
  }

  get currentUserProfile(): string {
    return this.user?.perfilAcesso || 'OPERADOR';
  }

  get isAdministrator(): boolean {
    return this.currentUserProfile === 'ADMINISTRADOR';
  }

  get isAuthenticated(): boolean {
    return Boolean(this.token);
  }

  async login(email: string, senha: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', { email, senha });
    this.storeSession(response);
    return response;
  }

  async register(nome: string, email: string, senha: string, perfilAcesso = 'OPERADOR'): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/registro', { nome, email, senha, perfilAcesso });
    this.storeSession(response);
    return response;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  private storeSession(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(response));
  }
}