import { StorageService, StorageType } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterEventType, RouterService } from '@spryker-oryx/experience';
import { of } from 'rxjs';
import { DefaultRouterService } from './default-router.service';

class MockStorageService implements Partial<StorageService> {
  get = vi.fn();
  set = vi.fn();
}

describe('DefaultRouterService', () => {
  let service: DefaultRouterService;
  let storageService: MockStorageService;

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

  it('should provide the current route', () => {
    service.go('/mock');

    service.currentRoute().subscribe((route) => {
      expect(route).toBe('/mock');
    });
  });

  it('should navigate back in history', () => {
    vi.spyOn(window.history, 'back');
    service.back();
    expect(window.history.back).toHaveBeenCalled();
  });

  it('should get events on navigation', () => {
    service.go('/mock');
    service.getEvents(RouterEventType.NavigationEnd).subscribe((value) => {
      expect(value.type).toBe(RouterEventType.NavigationEnd);
    });
  });

  it('should store the current and previous routes when navigating', () => {
    service.go('/last');

    service.currentRoute().subscribe((route) => {
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
});
