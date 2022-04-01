import { HttpService, RequestOptions } from '@spryker-oryx/core';
import { Observable } from 'rxjs';
import { ssrAwaiter } from '../ssr-awaiter';

export class HttpServerService extends HttpService {
  request<T = unknown>(
    url: string,
    options?: RequestOptions<T>
  ): Observable<T> {
    return ssrAwaiter(super.request(url, options), this);
  }
}
