import { Observable, switchMap } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { HttpService } from './http.service';
import { HttpErrorResponse, RequestOptions } from './model';

export class DefaultHttpService implements HttpService {
  request<T = unknown>(
    url: string,
    options?: RequestOptions<T>
  ): Observable<T> {
    return fromFetch(url, {
      ...options,
    }).pipe(
      switchMap((response) => {
        if (!response.ok) {
          const { headers, ok, redirected, status, statusText, type, url } =
            response;
          const error = new Error(
            `${status} ${statusText}`
          ) as HttpErrorResponse;

          error.name = 'FES.HttpErrorResponse';
          error.headers = headers;
          error.ok = ok;
          error.redirected = redirected;
          error.status = status;
          error.statusText = statusText;
          error.type = type;
          error.url = url;

          throw error;
        }

        return options?.parser?.(response) ?? response.json();
      })
    );
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
