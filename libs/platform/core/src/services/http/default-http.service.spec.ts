import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { DefaultHttpService } from './default-http.service';
import { HttpHandler } from './handler';
import { HttpService } from './http.service';

const mockUrl = 'https://mockurl/';
const mockOptions = {
  keepalive: true,
  headers: {
    'content-type': 'application/json',
    custom: 'custom',
  },
};
const mockBody = {
  test: 'test',
};

class MockHttpHandler implements HttpHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected request: Record<string, any> = {};

  handle = vi.fn().mockImplementation((req: Request) => {
    this.request.url = req.url;
    this.request.method = req.method;
    this.request.headers = {};

    for (const [key, value] of req.headers.entries())
      this.request.headers[key] = value;

    if (req.body) this.request.body = req.json();

    return of({ ok: true });
  });

  getRequestData(): Record<string, unknown> {
    return this.request;
  }
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
    expect(httpHandler.getRequestData()).toEqual({
      url: mockUrl,
      headers: mockOptions.headers,
      method: 'GET',
    });
  });

  it('get method should call `HttpHandler.handle` with proper parameters', () => {
    service.get(mockUrl, mockOptions);

    expect(httpHandler.getRequestData()).toEqual({
      url: mockUrl,
      headers: mockOptions.headers,
      method: 'GET',
    });
  });

  it('post method should call `HttpHandler.handle` with proper parameters', async () => {
    service.post(mockUrl, mockBody, mockOptions);
    const body = await httpHandler.getRequestData().body;

    expect(httpHandler.getRequestData()).toEqual(
      expect.objectContaining({
        url: mockUrl,
        headers: mockOptions.headers,
        method: 'POST',
      })
    );
    expect(body).toEqual(mockBody);
  });

  it('patch method should call `HttpHandler.handle` with proper parameters', async () => {
    service.patch(mockUrl, mockBody, mockOptions);
    const body = await httpHandler.getRequestData().body;

    expect(httpHandler.getRequestData()).toEqual(
      expect.objectContaining({
        url: mockUrl,
        headers: mockOptions.headers,
        method: 'PATCH',
      })
    );
    expect(body).toEqual(mockBody);
  });

  it('delete method should call `HttpHandler.handle` with proper parameters', () => {
    service.delete(mockUrl, mockOptions);

    expect(httpHandler.getRequestData()).toEqual({
      url: mockUrl,
      headers: mockOptions.headers,
      method: 'DELETE',
    });
  });

  it('should return result from custom parser', () => {
    const parser = vi.fn().mockReturnValue(of('parser'));
    const request = { ok: true, body: 'handleResult' };
    const callback = vi.fn();

    httpHandler.handle.mockReturnValue(of(request));
    service.request(mockUrl, { parser }).subscribe(callback);

    expect(parser).toHaveBeenCalledWith(request);
    expect(callback).toHaveBeenCalledWith('parser');
  });
});
