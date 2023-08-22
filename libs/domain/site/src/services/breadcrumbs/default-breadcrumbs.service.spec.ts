import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouteWithParams, RouterService } from '@spryker-oryx/router';
import { Observable, of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { Breadcrumb } from '../../models';
import { FallbackBreadcrumbsResolver } from '../resolvers';
import {
  BreadcrumbsResolver,
  BreadcrumbsResolvers,
  BreadcrumbsService,
} from './breadcrumbs.service';
import { DefaultBreadcrumbsService } from './default-breadcrumbs.service';

const breadcrumb = { text: 'test' };
const route: Partial<RouteWithParams> = { type: 'test' };

class TestResolver implements BreadcrumbsResolver {
  resolve(): Observable<Breadcrumb[]> {
    return of([breadcrumb]);
  }
}

class MockRouterService implements Partial<RouterService> {
  current = vi.fn().mockReturnValue(of(route));
}

describe('DefaultBreadcrumbsService', () => {
  let service: BreadcrumbsService;
  let routerService: MockRouterService;
  let resolver: TestResolver;
  let defaultResolver: TestResolver;
  const callback = vi.fn();

  beforeAll(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: BreadcrumbsService,
          useClass: DefaultBreadcrumbsService,
        },
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
        {
          provide: `${BreadcrumbsResolvers}test`,
          useClass: TestResolver,
        },
        {
          provide: FallbackBreadcrumbsResolver,
          useClass: TestResolver,
        },
      ],
    });

    service =
      testInjector.inject<DefaultBreadcrumbsService>(BreadcrumbsService);
    routerService = testInjector.inject<MockRouterService>(RouterService);
    resolver = testInjector.inject<TestResolver>(`${BreadcrumbsResolvers}test`);
    defaultResolver = testInjector.inject<TestResolver>(
      FallbackBreadcrumbsResolver
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  describe('when breadcrumbs resolver`s type exists', () => {
    let spy: SpyInstance;
    beforeEach(() => {
      spy = vi.spyOn(resolver, 'resolve');
      service.get().subscribe(callback);
    });

    it('should get the route type', () => {
      expect(routerService.current).toHaveBeenCalled();
    });

    it('should resolve the breadcrumbs from the service', () => {
      expect(spy).toHaveBeenCalled();
    });

    it('should return processed array of breadcrumbs', () => {
      expect(callback).toHaveBeenCalledWith(
        expect.arrayContaining([breadcrumb])
      );
    });
  });

  describe('when breadcrumbs resolver`s type does not exist', () => {
    let spy: SpyInstance;
    beforeEach(() => {
      routerService.current = vi.fn().mockReturnValue(of({ type: 'test1' }));
      spy = vi.spyOn(defaultResolver, 'resolve');
      service.get().subscribe(callback);
    });

    it('should resolve the breadcrumbs from the fallback service', () => {
      expect(spy).toHaveBeenCalled();
    });

    it('should return processed array of default breadcrumbs', () => {
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

    it('should resolve the breadcrumbs from the fallback service', () => {
      expect(spy).toHaveBeenCalled();
    });

    it('should return processed array of default breadcrumbs', () => {
      expect(callback).toHaveBeenCalledWith(
        expect.arrayContaining([breadcrumb])
      );
    });
  });
});
