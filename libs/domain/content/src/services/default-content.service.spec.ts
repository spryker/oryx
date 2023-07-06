import { DefaultQueryService, QueryService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { Observable, of, switchMap, take } from 'rxjs';
import { SpyInstance } from 'vitest';
import { ContentAdapter, ContentService, DefaultContentService } from '.';

const mockContentAdapter = {
  getKey: vi.fn(),
  get: vi.fn(),
};

describe('DefaultContentService', () => {
  let service: ContentService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: ContentService,
          useClass: DefaultContentService,
        },
        {
          provide: ContentAdapter,
          useValue: mockContentAdapter,
        },
        {
          provide: QueryService,
          useClass: DefaultQueryService,
        },
      ],
    });

    service = testInjector.inject(ContentService);
  });

  afterEach(() => {
    vi.resetAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultContentService);
  });

  describe('get', () => {
    it('should return an observable', () => {
      expect(service.get({})).toBeInstanceOf(Observable);
    });

    it('should return an observable with a content from adapter', () => {
      const callback = vi.fn();
      mockContentAdapter.get.mockReturnValue(of({ name: 'adapter 123' }));
      service.get({ id: '123' }).subscribe(callback);
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'adapter 123' })
      );
    });

    it('should call `get` method of adapter only for getting new content', () => {
      mockContentAdapter.get.mockReturnValue(of({ name: 'adapter 123' }));
      service.get({ id: '123' }).pipe(take(1)).subscribe();
      expect(mockContentAdapter.get).toHaveBeenCalledTimes(1);
      service.get({ id: '123' }).pipe(take(1)).subscribe();
      expect(mockContentAdapter.get).toHaveBeenCalledTimes(1);
      service.get({ id: '124' }).pipe(take(1)).subscribe();
      expect(mockContentAdapter.get).toHaveBeenCalledTimes(2);
    });

    it('should return an observable with undefined if error has been caught', () => {
      (mockContentAdapter.get as unknown as SpyInstance).mockReturnValue(
        of(null).pipe(
          switchMap(() => {
            throw 'error';
          })
        )
      );
      const callback = vi.fn();
      service.get({}).subscribe(callback);
      expect(callback).toHaveBeenCalledWith(undefined);
    });
  });

  describe('getState', () => {
    it('should return an observable', () => {
      expect(service.getState({})).toBeInstanceOf(Observable);
    });

    it('should return an observable with a content state from adapter', () => {
      const callback = vi.fn();
      mockContentAdapter.get.mockReturnValue(of({ name: 'adapter 123' }));
      service.getState({ id: '123' }).subscribe(callback);
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ data: { name: 'adapter 123' } })
      );
    });

    it('should call `get` method of adapter only for getting new content', () => {
      mockContentAdapter.get.mockReturnValue(of({ name: 'adapter 123' }));
      service.getState({ id: '123' }).pipe(take(1)).subscribe();
      expect(mockContentAdapter.get).toHaveBeenCalledTimes(1);
      service.getState({ id: '123' }).pipe(take(1)).subscribe();
      expect(mockContentAdapter.get).toHaveBeenCalledTimes(1);
      service.getState({ id: '124' }).pipe(take(1)).subscribe();
      expect(mockContentAdapter.get).toHaveBeenCalledTimes(2);
    });

    it('should return an observable with error state if error has been caught', () => {
      const testError = new Error();
      (mockContentAdapter.get as unknown as SpyInstance).mockReturnValue(
        of(null).pipe(
          switchMap(() => {
            throw testError;
          })
        )
      );
      const callback = vi.fn();
      service.getState({}).subscribe(callback);
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ data: undefined, error: testError })
      );
    });
  });
});
