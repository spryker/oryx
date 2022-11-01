import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { of } from 'rxjs';
import { DefaultHttpService } from './default-http.service';
import { HttpHandler } from './handler';
import { HttpService } from './http.service';

const mockUrl = 'https://mockUrl';
const mockOptions = {
  keepalive: true,
  headers: {
    custom: 'custom',
  },
};
const mockBody = {
  test: 'test',
};

class MockHttpHandler implements HttpHandler {
  handle = vi.fn().mockReturnValue(of({ ok: true }));
}

describe('DefaultHttpService', () => {
  let service: HttpService;
  let httpHandler: MockHttpHandler;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: HttpService,
          useClass: DefaultHttpService,
        },
        {
          provide: HttpHandler,
          useClass: MockHttpHandler,
        },
      ],
    });
    service = testInjector.inject(HttpService);
    httpHandler = testInjector.inject(HttpHandler) as MockHttpHandler;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('request should throw an error', () =>
    new Promise<void>((done) => {
      service.request(mockUrl, mockOptions).subscribe({
        error: (error) => {
          expect(error).toBeDefined();
          done();
        },
      });
    }));

  it('request method should call `HttpHandler.handle` with proper parameters', () => {
    service.request(mockUrl, mockOptions);

    expect(httpHandler.handle).toHaveBeenCalledWith(mockUrl, mockOptions);
  });

  it('get method should call `HttpHandler.handle` with proper parameters', () => {
    service.get(mockUrl, mockOptions);

    expect(httpHandler.handle).toHaveBeenCalledWith(mockUrl, {
      ...mockOptions,
      method: 'GET',
    });
  });

  it('post method should call `HttpHandler.handle` with proper parameters', () => {
    service.post(mockUrl, mockBody, mockOptions);

    expect(httpHandler.handle).toHaveBeenCalledWith(mockUrl, {
      ...mockOptions,
      method: 'POST',
      body: JSON.stringify(mockBody),
    });
  });

  it('patch method should call `HttpHandler.handle` with proper parameters', () => {
    service.patch(mockUrl, mockBody, mockOptions);

    expect(httpHandler.handle).toHaveBeenCalledWith(mockUrl, {
      ...mockOptions,
      method: 'PATCH',
      body: JSON.stringify(mockBody),
    });
  });

  it('delete method should call `HttpHandler.handle` with proper parameters', () => {
    service.delete(mockUrl, mockOptions);

    expect(httpHandler.handle).toHaveBeenCalledWith(mockUrl, {
      ...mockOptions,
      method: 'DELETE',
    });
  });
});
