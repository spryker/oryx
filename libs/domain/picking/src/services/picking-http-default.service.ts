import { HttpService, injectEnv, RequestOptions } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable } from 'rxjs';
import { PickingHttpService } from './picking-http.service';

declare global {
  interface AppEnvironment {
    readonly ORYX_FULFILLMENT_BACKEND_URL?: string;
  }
}

export class PickingHttpDefaultService implements PickingHttpService {
  constructor(
    protected httpService = inject(HttpService),
    protected baseUrl = injectEnv('ORYX_FULFILLMENT_BACKEND_URL', '')
  ) {}

  request<T = unknown>(
    url: string,
    options?: RequestOptions<T>
  ): Observable<T> {
    url = this.createFullUrl(url);
    return this.httpService.request(url, options);
  }

  get<T = unknown>(url: string, options?: RequestOptions<T>): Observable<T> {
    url = this.createFullUrl(url);
    return this.httpService.get(url, {
      ...options,
      headers: {
        ...options?.headers,
        'Content-Type': 'application/vnd.api+json',
      },
    });
  }

  delete<T = unknown>(url: string, options?: RequestOptions<T>): Observable<T> {
    url = this.createFullUrl(url);
    return this.httpService.delete(url, options);
  }

  post<T = unknown>(
    url: string,
    body: unknown,
    options?: RequestOptions<T>
  ): Observable<T> {
    url = this.createFullUrl(url);
    return this.httpService.post(url, body, options);
  }

  patch<T = unknown>(
    url: string,
    body: unknown,
    options?: RequestOptions<T>
  ): Observable<T> {
    url = this.createFullUrl(url);
    return this.httpService.patch(url, body, options);
  }

  protected createFullUrl(url: string): string {
    return `${this.baseUrl}${url}`;
  }
}
