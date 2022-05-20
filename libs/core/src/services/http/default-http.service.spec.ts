import { catchError, of, Subject, takeUntil } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { SpyInstanceFn } from 'vitest';
import { DefaultHttpService } from './default-http.service';
import { HttpService } from './http.service';

vi.mock('rxjs/fetch', () => ({
  fromFetch: vi.fn(),
}));

const mockUrl = 'mockUrl';
const mockHeaders = {
  custom: 'custom',
};
const mockOptions = {
  keepalive: true,
  headers: mockHeaders,
};
const mockBody = {
  test: 'test',
};
const destroy$ = new Subject<void>();

describe('DefaultHttpService', () => {
  let service: HttpService;

  beforeEach(() => {
    service = new DefaultHttpService();
    (fromFetch as SpyInstanceFn<any[], any>).mockReturnValue(of({ ok: true }));
  });

  afterEach(() => {
    vi.resetAllMocks();
    destroy$.next();
  });

  it('request should throw an error', (done) => {
    const mockCallback = vi.fn();
    (fromFetch as SpyInstanceFn<any[], any>).mockReturnValue(
      of({ ok: false, status: 404, statusText: 'statusText' })
    );
    service
      .request(mockUrl, mockOptions)
      .pipe(takeUntil(destroy$), catchError(mockCallback))
      .subscribe({
        error: (error) => {
          expect(error).toBeDefined();
          done();
        },
      });
  });

  it('request method should call `fromFetch` with proper parameters', () => {
    service.request(mockUrl, mockOptions);

    expect(fromFetch).toHaveBeenCalledWith(mockUrl, {
      ...mockOptions,
      headers: mockHeaders,
    });
  });

  it('get method should call `fromFetch` with proper parameters', () => {
    service.get(mockUrl, mockOptions);

    expect(fromFetch).toHaveBeenCalledWith(mockUrl, {
      ...mockOptions,
      method: 'GET',
      headers: mockHeaders,
    });
  });

  it('post method should call `fromFetch` with proper parameters', () => {
    service.post(mockUrl, mockBody, mockOptions);

    expect(fromFetch).toHaveBeenCalledWith(mockUrl, {
      ...mockOptions,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...mockHeaders,
      },
      body: JSON.stringify(mockBody),
    });
  });

  it('patch method should call `fromFetch` with proper parameters', () => {
    service.patch(mockUrl, mockBody, mockOptions);

    expect(fromFetch).toHaveBeenCalledWith(mockUrl, {
      ...mockOptions,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...mockHeaders,
      },
      body: JSON.stringify(mockBody),
    });
  });
});
