/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { Observable, of } from 'rxjs';
import { HttpContract } from '../../../src/lib/services/http/http.contract';
import { RequestOptions } from '../../../src/lib/services/http/model';

export class HttpTestService implements HttpContract {
  protected response?: any;
  url?: string;

  request<T = unknown>(
    url: string,
    options?: RequestOptions<T>
  ): Observable<T> {
    this.url = url;

    return of(this.response);
  }

  get<T = unknown>(url: string, options?: RequestOptions<T>): Observable<T> {
    this.url = url;

    return of(this.response);
  }

  post<T = unknown>(
    url: string,
    body: unknown,
    options?: RequestOptions<T>
  ): Observable<T> {
    this.url = url;

    return of(this.response);
  }

  patch<T = unknown>(
    url: string,
    body: unknown,
    options?: RequestOptions<T>
  ): Observable<T> {
    this.url = url;

    return of(this.response);
  }

  flush(mockData: any): void {
    this.response = mockData;
  }

  clear(): void {
    this.response = undefined;
    this.url = undefined;
  }
}
