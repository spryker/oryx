/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { HttpService, RequestOptions } from '@spryker-oryx/core';
import { BehaviorSubject, filter, Observable, take, tap } from 'rxjs';

const NO_RESPONSE = Symbol('NO_RESPONSE');

export class HttpTestService implements HttpService {
  protected responseSubject$ = new BehaviorSubject<any>(NO_RESPONSE);
  protected response$ = this.responseSubject$.pipe(
    filter((x) => x !== NO_RESPONSE),
    take(1),
    tap(() => this.responseSubject$.next(NO_RESPONSE))
  );

  url?: string;
  // in case of multiple requests, all requests are collected
  urls: string[] = [];
  method?: string;
  body?: unknown;
  options?: unknown;

  request<T = unknown>(
    url: string,
    options?: RequestOptions<T>
  ): Observable<T> {
    this.url = url;
    this.urls.push(url);
    this.options = options;
    this.method = options?.method;

    return this.response$;
  }

  get<T = unknown>(
    url: string,
    options: RequestOptions<T> = {}
  ): Observable<T> {
    return this.request(url, {
      ...options,
      method: 'GET',
    });
  }

  post<T = unknown>(
    url: string,
    body: unknown,
    options: RequestOptions<T> = {}
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
    options: RequestOptions<T> = {}
  ): Observable<T> {
    this.body = body;

    return this.request(url, {
      ...options,
      method: 'PATCH',
    });
  }

  /**
   * Flush has to be called in order to resolve next request
   *
   * @param mockData
   */
  flush(mockData: any): void {
    this.responseSubject$.next(mockData);
  }

  clear(): void {
    this.responseSubject$.next(NO_RESPONSE);
    this.url = undefined;
    this.urls = [];
  }

  delete<T = unknown>(
    url: string,
    options: RequestOptions<T> = {}
  ): Observable<T> {
    return this.request(url, {
      ...options,
      method: 'DELETE',
    });
  }
}
