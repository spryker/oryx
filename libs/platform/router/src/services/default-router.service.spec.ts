import { StorageService, StorageType } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { DefaultRouterService } from './default-router.service';
import { RouterEventType, RouterService } from './router.service';

class MockStorageService implements Partial<StorageService> {
  get = vi.fn();
  set = vi.fn();
}

describe('DefaultRouterService', () => {
  let service: DefaultRouterService;
  let storageService: MockStorageService;

  const checkQueryParams = (expectedParams: { [key: string]: string }) =>
    service
      .currentQuery()
      .subscribe((params) => {
        expect(params).toEqual(expectedParams);
      })
      .unsubscribe();

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: StorageService,
          useClass: MockStorageService,
        },
        {
          provide: RouterService,
          useClass: DefaultRouterService,
        },
      ],
    });

    service = testInjector.inject(
      RouterService
    ) as unknown as DefaultRouterService;
    storageService = testInjector.inject(
      StorageService
    ) as unknown as MockStorageService;
  });

  afterEach(() => {
    destroyInjector();
  });

  it('should provide a service', () => {
    expect(service).toBeInstanceOf(DefaultRouterService);
  });

  describe('when route changes', () => {
    beforeEach(() => {
      service.go('/mock');
    });

    it('should provide the current route', () => {
      service.currentRoute().subscribe((route) => {
        expect(route).toBe('/mock');
      });
    });
  });

  describe('when query params are provided', () => {
    describe('for current route', () => {
      beforeEach(() => {
        service.go('/?query=one');
      });

      it('should provide the current query', () => {
        checkQueryParams({ query: 'one' });
      });
    });
    describe('with new route', () => {
      beforeEach(() => {
        service.go('mock/?query=one');
      });

      it('should provide the current query', () => {
        checkQueryParams({ query: 'one' });
      });

      describe('and query params change', () => {
        beforeEach(() => {
          service.go('/?query=two');
        });

        it('should provide the current query', () => {
          checkQueryParams({ query: 'two' });
        });
      });
    });
  });

  it('should update the current query', () => {
    service.go('/?firstQuery=one');
    checkQueryParams({ firstQuery: 'one' });

    service.go('/?firstQuery=two');
    checkQueryParams({ firstQuery: 'two' });

    service.go('/?secondParam=two');
    checkQueryParams({ secondParam: 'two' });

    service.go('/route', {
      queryParams: {
        thirdParam: 'three',
      },
    });
    checkQueryParams({ thirdParam: 'three' });

    service.go('/?firstQuery=one&secondQuery=two');
    checkQueryParams({
      firstQuery: 'one',
      secondQuery: 'two',
    });

    service.go('/?multiQuery=one,two');
    checkQueryParams({
      multiQuery: 'one,two',
    });
  });

  it('should navigate back in history', () => {
    const historyBackSpy = vi.spyOn(globalThis.history, 'back');

    service.back();

    expect(historyBackSpy).toHaveBeenCalled();
  });

  it('should get events on navigation', () => {
    service.go('/mock');
    service.getEvents(RouterEventType.NavigationEnd).subscribe((value) => {
      expect(value.type).toBe(RouterEventType.NavigationEnd);
    });
  });

  it('should store the current and previous routes when navigating', () => {
    service.go('/last');

    service.currentRoute().subscribe(() => {
      expect(storageService.set).toHaveBeenCalledWith(
        'currentPage',
        '/last',
        StorageType.SESSION
      );
    });

    storageService.get.mockReturnValueOnce(of('/last'));

    service.go('/current');
    expect(storageService.set).toHaveBeenCalledWith(
      'previousPage',
      '/last',
      StorageType.SESSION
    );
    expect(storageService.set).toHaveBeenCalledWith(
      'currentPage',
      '/current',
      StorageType.SESSION
    );
  });

  it('should accept route parameters', () => {
    const mock = { param: 'mock' };
    service.acceptParams(mock);
    service.currentParams().subscribe((param) => {
      expect(param).toBe(mock);
    });
  });

  it('should get previousRoute from storage', () => {
    service.previousRoute();
    expect(storageService.get).toHaveBeenCalledWith(
      'previousPage',
      StorageType.SESSION
    );
  });

  it('should navigate to new route', () => {
    service.navigate('/newRoute');
    service.route().subscribe((route) => {
      expect(route).toBe('/newRoute');
    });
  });

  it('should return proper pathId for nested route', () => {
    service.navigate('/id/id2/id3');
    expect(service.getPathId('id2')).toBe('id3');
  });

  it('should return undefined for uncorrected pathId', () => {
    service.navigate('/id/id2/id3');
    expect(service.getPathId('mock')).toBe(undefined);
  });

  it('should return proper url', () => {
    service.go('/route?firstQuery=one&secondQuery=two');
    service
      .getUrl('/route?multiQuery=one,two', {
        queryParamsHandling: 'merge',
        queryParams: { newQuery: 'new' },
        ignoreQueryParams: ['secondQuery'],
      })
      .subscribe((url) => {
        expect(url).toBe('/route?firstQuery=one&newQuery=new');
      });
  });

  it('should override queries for url', () => {
    service.go('/route?firstQuery=one&secondQuery=two');
    service
      .getUrl('/route?multiQuery=one,two', {
        queryParams: { newQuery: 'new', more: ['a', 'b'] },
      })
      .subscribe((url) => {
        expect(url).toBe('/route?newQuery=new&more=a,b');
      });
  });

  it('should return base url without queries', () => {
    service.go('/route?firstQuery=one&secondQuery=two');
    service.getUrl('/route?multiQuery=one,two', {}).subscribe((url) => {
      expect(url).toBe('/route');
    });
  });
});
