import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouteWithParams, RouterService } from '@spryker-oryx/router';
import { Observable, of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { BreadcrumbItem } from '../../models';
import { FallbackBreadcrumbResolver } from '../resolvers';
import {
  BreadcrumbResolver,
  BreadcrumbResolvers,
  BreadcrumbService,
} from './breadcrumb.service';
import { DefaultBreadcrumbService } from './default-breadcrumb.service';

const breadcrumb = { text: { raw: 'test' } };
const route: Partial<RouteWithParams> = { type: 'test' };

class TestResolver implements BreadcrumbResolver {
  resolve(): Observable<BreadcrumbItem[]> {
    return of([breadcrumb]);
  }
}

class MockRouterService implements Partial<RouterService> {
  current = vi.fn().mockReturnValue(of(route));
}

describe('DefaultBreadcrumbService', () => {
  let service: BreadcrumbService;
  let routerService: MockRouterService;
  let resolver: TestResolver;
  let defaultResolver: TestResolver;
  const callback = vi.fn();

  beforeAll(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: BreadcrumbService,
          useClass: DefaultBreadcrumbService,
        },
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
        {
          provide: `${BreadcrumbResolvers}test`,
          useClass: TestResolver,
        },
        {
          provide: FallbackBreadcrumbResolver,
          useClass: TestResolver,
        },
      ],
    });

    service = testInjector.inject<DefaultBreadcrumbService>(BreadcrumbService);
    routerService = testInjector.inject<MockRouterService>(RouterService);
    resolver = testInjector.inject<TestResolver>(`${BreadcrumbResolvers}test`);
    defaultResolver = testInjector.inject<TestResolver>(
      FallbackBreadcrumbResolver
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  describe('when breadcrumb resolver`s type exists', () => {
    let spy: SpyInstance;
    beforeEach(() => {
      spy = vi.spyOn(resolver, 'resolve');
      service.get().subscribe(callback);
    });

    it('should get the route type', () => {
      expect(routerService.current).toHaveBeenCalled();
    });

    it('should resolve the breadcrumb from the service', () => {
      expect(spy).toHaveBeenCalled();
    });

    it('should return processed array of breadcrumb', () => {
      expect(callback).toHaveBeenCalledWith(
        expect.arrayContaining([breadcrumb])
      );
    });
  });

  describe('when breadcrumb resolver`s type does not exist', () => {
    let spy: SpyInstance;
    beforeEach(() => {
      routerService.current = vi.fn().mockReturnValue(of({ type: 'test1' }));
      spy = vi.spyOn(defaultResolver, 'resolve');
      service.get().subscribe(callback);
    });

    it('should resolve the breadcrumb from the fallback service', () => {
      expect(spy).toHaveBeenCalled();
    });

    it('should return processed array of default breadcrumb', () => {
      expect(callback).toHaveBeenCalledWith(
        expect.arrayContaining([breadcrumb])
      );
    });
  });

  describe('when route does not nave type', () => {
    let spy: SpyInstance;
    beforeEach(() => {
      routerService.current = vi.fn().mockReturnValue(of({}));
      spy = vi.spyOn(defaultResolver, 'resolve');
      service.get().subscribe(callback);
    });

    it('should resolve the breadcrumb from the fallback service', () => {
      expect(spy).toHaveBeenCalled();
    });

    it('should return processed array of default breadcrumb', () => {
      expect(callback).toHaveBeenCalledWith(
        expect.arrayContaining([breadcrumb])
      );
    });
  });
});
