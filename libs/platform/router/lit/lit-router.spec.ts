import { mockLitHtml } from '@/tools/testing';
import { SSRAwaiterService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { LitElement } from 'lit';
import { of } from 'rxjs';
import 'urlpattern-polyfill';
import { LitRouter } from './lit-router';
import { LitRoutesRegistry } from './lit-routes-registry';

vi.mock('lit', async () => ({
  ...((await vi.importActual('lit')) as Array<unknown>),
  html: mockLitHtml,
}));

const mockRouterService = {
  currentRoute: vi.fn(),
  acceptParams: vi.fn(),
  go: vi.fn(),
};

const awaiterResolver = vi.fn();

const mockSSRAwaiterService = {
  getAwaiter: vi.fn().mockReturnValue(awaiterResolver),
};

const mockLitRoutesRegistry = {
  routes: [
    {
      path: '/c',
      name: 'c',
    },
    {
      path: '/d',
      name: 'd',
    },
  ],
};

const mockRouteConfig = [
  {
    path: '/a',
    name: 'a',
  },
  {
    path: '/b',
    name: 'b',
  },
];

const mockRouter = {
  goto: vi.fn(),
  outlet: vi.fn(),
};

vi.mock('@lit-labs/router', async () => ({
  Router: class {
    params = 'routerParams';
    async goto(pathname: string) {
      mockRouter.goto(pathname);
    }
    outlet() {
      return mockRouter.outlet();
    }
  },
}));

describe('DefaultRouterService', () => {
  let router: LitRouter;

  beforeEach(() => {
    vi.stubGlobal('location', { assign: vi.fn() });

    createInjector({
      providers: [
        {
          provide: RouterService,
          useValue: mockRouterService,
        },
        {
          provide: SSRAwaiterService,
          useValue: mockSSRAwaiterService,
        },
        {
          provide: LitRoutesRegistry,
          useValue: mockLitRoutesRegistry,
        },
      ],
    });

    mockRouterService.currentRoute.mockReturnValue(of('/initial'));
    router = new LitRouter({} as unknown as LitElement, mockRouteConfig);
  });

  afterEach(() => {
    destroyInjector();
    vi.resetAllMocks();
  });

  it('should call router service on construction time', () => {
    expect(mockSSRAwaiterService.getAwaiter).toHaveBeenCalled();
    expect(mockRouter.goto).toHaveBeenCalledWith('/initial');
    expect(mockRouterService.acceptParams).toHaveBeenCalledWith('routerParams');
    expect(awaiterResolver).toHaveBeenCalled();
  });

  describe('goto', () => {
    it('should call extended router with proper params', async () => {
      await router.goto('/newGoPath');
      expect(mockRouter.goto).toHaveBeenCalledWith('/newGoPath');
    });

    it('should call RouterService.go with proper params', async () => {
      globalThis.location.search = '?q=query';
      await router.goto('/newGoPath');
      expect(mockRouterService.go).toHaveBeenCalledWith('/newGoPath', {
        queryParams: { q: 'query' },
      });
    });
  });

  describe('outlet', () => {
    it('should call extended router', () => {
      router.outlet();
      expect(mockRouter.outlet).toHaveBeenCalled();
    });

    it('should return proper template result', async () => {
      mockRouter.outlet.mockReturnValue('outletResult');
      expect(router.outlet()).toBe('<outlet>outletResult</outlet>');
    });
  });
});
