import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { map, Observable, of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { SpyInstance } from 'vitest';
import { RequestOptions } from '../http.model';
import { DefaultHttpHandler } from './default-http-handler';
import {
  HttpHandler,
  HttpHandlerFn,
  HttpInterceptor,
} from './http-handler.model';

const mockFromFetchResult = {
  original: 'original',
};
const mockUrl = 'url';
const mockOptions = {};
const callback = vi.fn();

vi.mock('rxjs/fetch', () => ({
  fromFetch: vi.fn(),
}));

export class InterceptorA implements HttpInterceptor {
  intercept(
    url: string,
    options: RequestOptions,
    handle: HttpHandlerFn
  ): Observable<Response> {
    options = {
      ...options,
      a: 'a',
    } as RequestOptions;

    return handle(url, options).pipe(
      map((res) => ({
        ...res,
        a: 'a',
      }))
    );
  }
}

export class InterceptorB implements HttpInterceptor {
  intercept(
    url: string,
    options: RequestOptions,
    handle: HttpHandlerFn
  ): Observable<Response> {
    return handle(url, options).pipe(
      map((res) => ({
        ...res,
        b: 'b',
      }))
    );
  }
}

export class InterceptorC implements HttpInterceptor {
  intercept(
    url: string,
    options: RequestOptions,
    handle: HttpHandlerFn
  ): Observable<Response> {
    options = {
      ...options,
      c: 'c',
    } as RequestOptions;

    return handle(url, options);
  }
}

describe('DefaultHttpHandler', () => {
  let handler: HttpHandler;

  afterEach(() => {
    vi.resetAllMocks();
    destroyInjector();
  });

  beforeEach(() => {
    (fromFetch as unknown as SpyInstance).mockReturnValue(
      of(mockFromFetchResult)
    );
  });

  describe('when interceptors are not defined', () => {
    beforeEach(() => {
      const testInjector = createInjector({
        providers: [
          {
            provide: HttpHandler,
            useClass: DefaultHttpHandler,
          },
        ],
      });

      handler = testInjector.inject(HttpHandler);
    });

    it('should return result of fromFetch', () => {
      handler.handle(mockUrl, mockOptions).subscribe(callback);
      expect(fromFetch).toHaveBeenCalledWith(mockUrl, mockOptions);
      expect(callback).toHaveBeenCalledWith(mockFromFetchResult);
    });
  });

  describe('when interceptors are defined', () => {
    beforeEach(() => {
      const testInjector = createInjector({
        providers: [
          {
            provide: HttpHandler,
            useClass: DefaultHttpHandler,
          },
          {
            provide: `${HttpInterceptor}A`,
            useClass: InterceptorA,
          },
          {
            provide: `${HttpInterceptor}B`,
            useClass: InterceptorB,
          },
          {
            provide: `${HttpInterceptor}C`,
            useClass: InterceptorC,
          },
        ],
      });

      handler = testInjector.inject(HttpHandler);
    });

    it('should transform request and call formFetch with new options', () => {
      handler.handle(mockUrl, mockOptions);
      expect(fromFetch).toHaveBeenCalledWith(mockUrl, {
        a: 'a',
        c: 'c',
      });
    });

    it('should transform response and return it', () => {
      handler.handle(mockUrl, mockOptions).subscribe(callback);
      expect(callback).toHaveBeenCalledWith({
        ...mockFromFetchResult,
        a: 'a',
        b: 'b',
      });
    });
  });
});
