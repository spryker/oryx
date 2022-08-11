import { DefaultHttpService, RequestOptions } from '@spryker-oryx/core';
import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { Observable } from 'rxjs';

export class ServerHttpService extends DefaultHttpService {
  request<T = unknown>(
    url: string,
    options?: RequestOptions<T>
  ): Observable<T> {
    return ssrAwaiter(super.request(url, options));
  }
}
