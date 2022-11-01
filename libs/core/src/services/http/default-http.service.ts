import { inject } from '@spryker-oryx/injector';
import { Observable, of, switchMap } from 'rxjs';
import { HttpHandler } from './handler';
import {
  HttpErrorResponse,
  HttpErrorValues,
  RequestOptions,
  ResponseKeys,
} from './http.model';
import { HttpService } from './http.service';

const jsonRegex = /(?=.*application)(?=.*json)/;
const htmlRegex = /(?=.*text)(?=.*html)/;

export class DefaultHttpService implements HttpService {
  constructor(protected handler = inject(HttpHandler)) {}

  request<T = unknown>(url: string, options?: RequestOptions<T>): any {
    return this.handler.handle(url, options ?? {}).pipe(
      switchMap((response) => {
        if (!response.ok) {
          this.throwError(response);
        }

        if (options?.parser) {
          options?.parser?.(response);
        }

        const contentType = response.headers.get('content-type') ?? '';

        if (jsonRegex.test(contentType)) {
          return response.json();
        }

        if (htmlRegex.test(contentType)) {
          return response.text();
        }

        return of(null);
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
    return this.request(url, {
      ...options,
      body: JSON.stringify(body),
      method: 'POST',
    });
  }

  patch<T = unknown>(
    url: string,
    body: unknown,
    options?: RequestOptions<T>
  ): Observable<T> {
    return this.request(url, {
      ...options,
      body: JSON.stringify(body),
      method: 'PATCH',
    });
  }

  delete<T = unknown>(url: string, options?: RequestOptions<T>): Observable<T> {
    return this.request(url, {
      ...options,
      method: 'DELETE',
    });
  }

  protected throwError(response: Response): never {
    const error = new Error(
      `${response.status} ${response.statusText}`
    ) as HttpErrorResponse;

    for (const field of Object.values(ResponseKeys)) {
      (error as Record<typeof field, HttpErrorValues[typeof field]>)[field] =
        response[field];
    }

    throw error;
  }
}
