import { DefaultHttpService, RequestOptions } from '@spryker-oryx/core';
import { Observable } from 'rxjs';
import { ssrAwaiter } from '../ssr-awaiter';

export class ServerHttpService extends DefaultHttpService {
  request<T = unknown>(
    url: string,
    options?: RequestOptions<T>
  ): Observable<T> {
    return ssrAwaiter(super.request(url, options));
  }
}
