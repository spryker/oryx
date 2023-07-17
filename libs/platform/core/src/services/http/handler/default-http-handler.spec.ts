import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { map, Observable, of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { Mock } from 'vitest';
import { DefaultHttpHandler } from './default-http-handler';
import {
  HttpHandler,
  HttpHandlerFn,
  HttpInterceptor,
} from './http-handler.model';

const mockFromFetchResult = {
  original: 'original',
};
const mockUrl = 'http://url';
const mockRequest = new Request(mockUrl);
mockRequest.headers.set('a', 'initial');
const callback = vi.fn();

vi.mock('rxjs/fetch', () => ({
  fromFetch: vi.fn(),
}));

export class InterceptorA implements HttpInterceptor {
  intercept(req: Request, handle: HttpHandlerFn): Observable<Response> {
    const newReq = req.clone();
    newReq.headers.set('a', 'a');

    return handle(newReq).pipe(
      map((res) => ({
        ...res,
        a: 'a',
      }))
    );
  }
}

export class InterceptorB implements HttpInterceptor {
  intercept(req: Request, handle: HttpHandlerFn): Observable<Response> {
    return handle(req).pipe(
      map((res) => ({
        ...res,
        b: 'b',
      }))
    );
  }
}

export class InterceptorC implements HttpInterceptor {
  intercept(req: Request, handle: HttpHandlerFn): Observable<Response> {
    const newReq = req.clone();
    newReq.headers.set('c', 'c');

    return handle(newReq);
  }
}

export class InterceptorD implements HttpInterceptor {
  intercept(req: Request, handle: HttpHandlerFn): Observable<Response> {
    const newReq = req.clone();
    newReq.headers.set('c', 'd');

    return handle(newReq);
  }

  shouldInterceptRequest(): boolean {
    return false;
  }
}

describe('DefaultHttpHandler', () => {
  let handler: HttpHandler;

  afterEach(() => {
    vi.resetAllMocks();
    destroyInjector();
  });

  beforeEach(() => {
    (fromFetch as Mock).mockReturnValue(of(mockFromFetchResult));
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
      handler.handle(mockRequest).subscribe(callback);
      expect(fromFetch).toHaveBeenCalledWith(mockRequest);
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
            provide: HttpInterceptor,
            useClass: InterceptorA,
          },
          {
            provide: HttpInterceptor,
            useClass: InterceptorB,
          },
          {
            provide: HttpInterceptor,
            useClass: InterceptorC,
          },
        ],
      });

      handler = testInjector.inject(HttpHandler);
    });

    it('should transform request and call formFetch with new options', () => {
      handler.handle(mockRequest);
      const newReq = mockRequest.clone();
      newReq.headers.set('a', 'a');
      newReq.headers.set('c', 'c');
      expect(fromFetch).toHaveBeenCalledWith(newReq);
    });

    it('should transform response and return it', () => {
      handler.handle(mockRequest).subscribe(callback);
      expect(callback).toHaveBeenCalledWith({
        ...mockFromFetchResult,
        a: 'a',
        b: 'b',
      });
    });
  });

  describe('when should skip request interceptor', () => {
    beforeEach(() => {
      const testInjector = createInjector({
        providers: [
          {
            provide: HttpHandler,
            useClass: DefaultHttpHandler,
          },
          {
            provide: HttpInterceptor,
            useClass: InterceptorD,
          },
        ],
      });

      handler = testInjector.inject(HttpHandler);
    });

    it('should not provide request transformation', () => {
      handler.handle(mockRequest);
      expect(fromFetch).toHaveBeenCalledWith(mockRequest);
    });
  });
});
