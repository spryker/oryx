import { Observable } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { HttpClientOptions } from './model';

export class HttpClientService {
  request<T = unknown>(
    url: string,
    options?: HttpClientOptions<T>
  ): Observable<T> {
    const headers = {
      Accept: 'application/vnd.api+json',
      ...options?.headers,
    };

    return fromFetch<T>(url, {
      ...options,
      headers,
      selector: (response) => options?.parser?.(response) ?? response.json(),
    });
  }

  get<T = unknown>(url: string, options?: HttpClientOptions<T>): Observable<T> {
    return this.request(url, {
      ...options,
      method: 'GET',
    });
  }

  post<T = unknown>(
    url: string,
    body: BodyInit,
    options?: HttpClientOptions<T>
  ): Observable<T> {
    return this.request(url, {
      ...options,
      body,
      method: 'POST',
    });
  }
}
