/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { HttpService, RequestOptions } from '@spryker-oryx/core';
import { defer, Observable, of } from 'rxjs';

export class HttpTestService implements HttpService {
  protected response?: any;
  url?: string;
  method?: string;
  body?: unknown;
  options?: unknown;

  request<T = unknown>(
    url: string,
    options?: RequestOptions<T>
  ): Observable<T> {
    this.url = url;
    this.options = options;
    this.method = options?.method;

    return defer(() => of(this.response));
  }

  get<T = unknown>(url: string, options?: RequestOptions<T>): Observable<T> {
    return this.request(url, {
      ...options,
      method: 'GET',
    });
  }

  post<T = unknown>(
    url: string,
    body: unknown,
    options?: RequestOptions<T>
  ): Observable<T> {
    this.body = body;

    return this.request(url, {
      ...options,
      method: 'POST',
    });
  }

  patch<T = unknown>(
    url: string,
    body: unknown,
    options?: RequestOptions<T>
  ): Observable<T> {
    this.body = body;

    return this.request(url, {
      ...options,
      method: 'PATCH',
    });
  }

  flush(mockData: any): void {
    this.response = mockData;
  }

  clear(): void {
    this.response = undefined;
    this.url = undefined;
  }

  delete<T = unknown>(url: string, options: RequestOptions<T>): Observable<T> {
    return this.request(url, {
      ...options,
      method: 'DELETE',
    });
  }
}
