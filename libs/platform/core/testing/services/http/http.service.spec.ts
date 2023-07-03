import { Subject, takeUntil } from 'rxjs';
import { HttpTestService } from './http-test.service';

describe('HttpTestService', () => {
  let service: HttpTestService;

  beforeEach(() => {
    service = new HttpTestService();
  });

  it('should return mocked response as observable on request/patch/post/get', () => {
    const destroy$ = new Subject();
    const callback = vi.fn();
    const mockedResponse = 'mockedResponse';
    const mockUrl = 'mockUrl';

    service.flush(mockedResponse);
    service.request(mockUrl).pipe(takeUntil(destroy$)).subscribe(callback);
    expect(callback).toHaveBeenCalledWith(mockedResponse);
    service.clear();
    callback.mockClear();
    destroy$.next(null);

    service.flush(mockedResponse);
    service.get(mockUrl).pipe(takeUntil(destroy$)).subscribe(callback);
    expect(callback).toHaveBeenCalledWith(mockedResponse);
    service.clear();
    callback.mockClear();
    destroy$.next(null);

    service.flush(mockedResponse);
    service.post(mockUrl, '').pipe(takeUntil(destroy$)).subscribe(callback);
    expect(callback).toHaveBeenCalledWith(mockedResponse);
    service.clear();
    callback.mockClear();
    destroy$.next(null);

    service.flush(mockedResponse);
    service.patch(mockUrl, '').pipe(takeUntil(destroy$)).subscribe(callback);
    expect(callback).toHaveBeenCalledWith(mockedResponse);
    service.clear();
    callback.mockClear();
    destroy$.next(null);
  });

  it('should assign url on request/patch/post/get', () => {
    const mockUrl = 'mockUrl';

    service.request(mockUrl);
    expect(service.url).toBe(mockUrl);
    service.clear();

    service.get(mockUrl);
    expect(service.url).toBe(mockUrl);
    service.clear();

    service.post(mockUrl, '');
    expect(service.url).toBe(mockUrl);
    service.clear();

    service.patch(mockUrl, '');
    expect(service.url).toBe(mockUrl);
    service.clear();
  });

  it('clear method should clear mocked response and url', () => {
    const destroy$ = new Subject();

    const callback = vi.fn();
    const mockedResponse = 'mockedResponse';
    const mockUrl = 'mockUrl';

    service.flush(mockedResponse);
    service.request(mockUrl).pipe(takeUntil(destroy$)).subscribe(callback);
    expect(callback).toHaveBeenCalledWith(mockedResponse);
    expect(service.url).toBe(mockUrl);
    callback.mockClear();
    destroy$.next(null);
    service.clear();

    expect(service.url).toBe(undefined);
    service.request(mockUrl).subscribe(callback);
    expect(callback).not.toHaveBeenCalled();

    service.flush('test');
    expect(callback).toHaveBeenCalledWith('test');
  });
});
