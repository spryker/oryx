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
    return this.httpService.get(url, this.expandContentType(options));
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
    return this.httpService.post(url, body, this.expandContentType(options));
  }

  patch<T = unknown>(
    url: string,
    body: unknown,
    options?: RequestOptions<T>
  ): Observable<T> {
    url = this.createFullUrl(url);
    return this.httpService.patch(url, body, this.expandContentType(options));
  }

  protected createFullUrl(url: string): string {
    const isAuth = /.*\/(token|authorize|warehouse-user-assignments|push-notification-subscriptions)/.test(url);
    return `${isAuth ? 
      this.baseUrl:
      'https://glue-backend.de.b2c.internal-testing.demo-spryker.com'
    }${url}`;
  }

  protected expandContentType<T = unknown>(
    options?: RequestOptions<T>
  ): RequestOptions<T> {
    const headers = new Headers(options?.headers);
    headers.set('Content-Type', 'application/vnd.api+json');
    return {
      ...options,
      headers,
    };
  }
}
