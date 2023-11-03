import { inject } from '@spryker-oryx/di';
import { from, map, Observable, of, switchMap } from 'rxjs';
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

  request<T = unknown>(url: string, options: RequestOptions<T> = {}): any {
    const req = new Request(url, options);

    if (!req.headers.has('Content-Type'))
      req.headers.set('Content-Type', 'application/json');

    return this.handler.handle(req).pipe(
      switchMap((response) => {
        if (options.parser) return options.parser(response);

        const contentType = response.headers.get('content-type') ?? '';
        let body;

        if (jsonRegex.test(contentType)) body = response.json();

        if (htmlRegex.test(contentType)) body = response.text();

        if (!response.ok) return this.throwError(response, body);

        return body ?? of(null);
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

  protected throwError(
    response: Response,
    body?: Promise<unknown>
  ): Observable<never> {
    return from(body ?? of(null)).pipe(
      map((responseBody) => {
        const error = new Error(
          `${response.status} ${response.statusText}`
        ) as HttpErrorResponse;

        for (const field of Object.values(ResponseKeys)) {
          (error as Record<typeof field, HttpErrorValues[typeof field]>)[
            field
          ] = response[field];
        }

        if (responseBody) error.body = responseBody;

        throw error;
      })
    );
  }
}
