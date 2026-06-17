import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = window.location.port === '8081' ? '/api' : 'http://localhost:8081/api';

  async get<T>(path: string, token?: string): Promise<T> {
    return this.request<T>(path, { method: 'GET' }, token);
  }

  async post<T>(path: string, body: unknown, token?: string): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }, token);
  }

  async postForm<T>(path: string, body: FormData, token?: string): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      body
    }, token);
  }

  async put<T>(path: string, body: unknown, token?: string): Promise<T> {
    return this.request<T>(path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }, token);
  }

  async patch<T>(path: string, body: unknown, token?: string): Promise<T> {
    return this.request<T>(path, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }, token);
  }

  private async request<T>(path: string, init: RequestInit, token?: string): Promise<T> {
    const headers = new Headers(init.headers || {});

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers
    });

    const data = await this.readResponseData(response);

    if (!response.ok) {
      const payload = data as Record<string, unknown>;
      const message = payload['message'] as string | undefined;
      const error = payload['error'] as string | undefined;
      throw new Error(message || error || 'Falha na requisicao');
    }

    return data as T;
  }

  private async readResponseData(response: Response): Promise<unknown> {
    const text = await response.text();

    if (!text) {
      return {};
    }

    try {
      return JSON.parse(text);
    } catch {
      return { message: text };
    }
  }
}