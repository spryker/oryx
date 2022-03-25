import { Observable } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { HttpContract } from './http.contract';
import { RequestOptions } from './model';

export class HttpService implements HttpContract {
  request<T = unknown>(
    url: string,
    options?: RequestOptions<T>
  ): Observable<T> {
    return fromFetch<T>(url, {
      ...options,
      selector: (response) => options?.parser?.(response) ?? response.json(),
    });
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
    const headers = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    return this.request(url, {
      ...options,
      body: JSON.stringify(body),
      headers,
      method: 'POST',
    });
  }

  patch<T = unknown>(
    url: string,
    body: unknown,
    options?: RequestOptions<T>
  ): Observable<T> {
    const headers = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    return this.request(url, {
      ...options,
      body: JSON.stringify(body),
      headers,
      method: 'PATCH',
    });
  }
}
