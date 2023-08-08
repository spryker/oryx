import { fixture } from '@open-wc/testing-helpers';
import { SSRAwaiterService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { LitElement, TemplateResult, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { of } from 'rxjs';
import 'urlpattern-polyfill';
import { LitRouter } from './lit-router';
import { LitRoutesRegistry } from './lit-routes-registry';

const mockRouterService = {
  currentRoute: vi.fn(),
  acceptParams: vi.fn(),
  go: vi.fn(),
  setRoutes: vi.fn(),
  getNotFound: vi.fn(),
};

const awaiterResolver = vi.fn();

const mockSSRAwaiterService = {
  getAwaiter: vi.fn().mockReturnValue(awaiterResolver),
};

const mockLitRoutesRegistry = {
  routes: [
    {
      path: '/a',
      name: 'a',
    },
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

const mockFallbackConfig = {
  render: vi.fn(),
  name: 'f',
};

const mockRouteConfig = [
  {
    path: '/a',
    name: 'a',
    render: vi.fn(),
  },
  {
    path: '/b',
    name: 'b',
  },
  {
    path: '/c',
    name: 'c',
    leave: vi.fn(),
    render: vi.fn(),
  },
  {
    path: '/d/*',
    name: 'd',
    render: vi.fn(),
  },
  {
    path: '/e',
    name: 'e',
    render: vi.fn(),
    enter: vi.fn(),
  },
];

const mockReactiveController = {
  addController: vi.fn(),
  addEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
  requestUpdate: vi.fn(),
};

@customElement('mock-child-route')
class MockChildRoute extends LitElement {
  _routes = new LitRouter(this, [
    { path: ':id', render: ({ id }) => html`<h3>Mock Route ${id}</h3>` },
  ]);

  render(): TemplateResult {
    return html`
      <a id="abc" href="${this._routes.link('/d/abc')}">ABC</a>
      ${this._routes.outlet()}
    `;
  }
}

@customElement('mock-parent-route')
class MockParentRoute extends LitElement {
  _routes = new LitRouter(this, mockRouteConfig);

  render(): TemplateResult {
    return html`
      <a id="d" href="${this._routes.link('/d/def')}">DEF</a>
      <mock-child-route></mock-child-route>
    `;
  }
}

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

    mockRouterService.currentRoute.mockReturnValue(of('/a'));
    mockRouterService.getNotFound.mockReturnValue(of());

    mockRouteConfig[0].render = vi.fn().mockReturnValue(html`outletResult`);
    mockRouteConfig[3].render = vi
      .fn()
      .mockReturnValue(html`<mock-child-route></mock-child-route>`);
  });

  afterEach(() => {
    destroyInjector();
    vi.resetAllMocks();
  });

  describe('when lit router is created', () => {
    beforeEach(() => {
      router = new LitRouter(
        mockReactiveController as unknown as LitElement,
        mockRouteConfig,
        { fallback: mockFallbackConfig }
      );

      router.hostConnected();
    });

    afterEach(() => {
      router.hostDisconnected();
    });

    it('should call router service on construction time', () => {
      expect(mockSSRAwaiterService.getAwaiter).toHaveBeenCalled();
      expect(mockReactiveController.requestUpdate).toHaveBeenCalled();
      expect(awaiterResolver).toHaveBeenCalled();
    });

    it('should call addController', () => {
      expect(mockReactiveController.addController).toHaveBeenCalled();
    });

    describe('and goto is used', () => {
      it('should call RouterService.go with proper params', async () => {
        globalThis.location.search = '?q=query';
        await router.goto('/b');
        expect(mockRouterService.go).toHaveBeenCalledWith('/b', {
          queryParams: { q: 'query' },
        });
      });
    });

    describe('and outlet is used', () => {
      let outlet: LitElement;

      beforeEach(async () => {
        outlet = await fixture(router.outlet());
      });

      it('should call extended router', () => {
        expect(mockRouteConfig[0].render).toHaveBeenCalled();
      });

      it('should return proper template result', async () => {
        expect(outlet.tagName).toBe('OUTLET');
        expect(outlet.innerHTML).toContain('outletResult');
      });
    });

    describe('when anchor link is clicked', () => {
      let link: HTMLAnchorElement;
      const date = new Date();
      beforeEach(async () => {
        globalThis.location.pathname = '/a';
        history.replaceState({}, '');
        link = await fixture(html`<a href="/b">mock</a>`);

        vi.useFakeTimers();
        vi.setSystemTime(date);

        link.click();
      });

      afterEach(() => {
        vi.useRealTimers();
      });

      it('should call history pushState', () => {
        expect(history.state.timestamp).toBe(date.getTime());
      });

      it('should call request update', () => {
        expect(mockReactiveController.requestUpdate).toHaveBeenCalled();
      });
    });

    describe('when navigating back', () => {
      beforeEach(async () => {
        globalThis.location.pathname = '/a';
        await router.goto('/a');
        await router.goto('/b');
        window.dispatchEvent(new Event('popstate'));
      });

      it('should call mockRouterService', async () => {
        // First call is from setup
        expect(mockRouterService.go).toHaveBeenNthCalledWith(2, '/a', {
          queryParams: { undefined: '' },
        });
        expect(mockRouterService.go).toHaveBeenLastCalledWith('/a', {
          queryParams: { undefined: '' },
        });
        expect(mockRouterService.go).toHaveBeenCalledWith('/b', {
          queryParams: { undefined: '' },
        });
      });
    });

    describe('when navigating a link that does not exist', () => {
      beforeEach(async () => {
        await router.goto('/mock');
      });

      it('should navigate to fallback', () => {
        expect(mockRouterService.go).toHaveBeenCalledWith('/mock', {
          queryParams: { undefined: '' },
        });
      });

      it('should call falback render', () => {
        router.outlet();
        expect(mockFallbackConfig.render).toHaveBeenCalled();
      });
    });

    describe('when entering a route with enter guard', () => {
      describe('and enter guard returns a boolean observable', () => {
        beforeEach(async () => {
          mockRouteConfig[4].enter = vi.fn().mockReturnValue(of(false));
          await router.goto('/e');
          router.outlet();
        });

        it('should call enter guard', () => {
          expect(mockRouteConfig[4].enter).toHaveBeenCalled();
        });

        describe('and cannot enter route', () => {
          it('should not call render', () => {
            expect(mockRouteConfig[4].render).not.toHaveBeenCalled();
          });
        });

        describe('and can enter route', () => {
          beforeEach(async () => {
            mockRouteConfig[4].enter?.mockReturnValue(of(true));
            await router.goto('/e');
            router.outlet();
          });

          it('should call render', () => {
            expect(mockRouteConfig[4].render).toHaveBeenCalled();
          });
        });
      });

      describe('and enter guard returns a boolean', () => {
        beforeEach(async () => {
          mockRouteConfig[4].enter = vi.fn().mockReturnValue(false);
          await router.goto('/e');
          router.outlet();
        });

        it('should call enter guard', () => {
          expect(mockRouteConfig[4].enter).toHaveBeenCalled();
        });

        describe('and cannot enter route', () => {
          it('should not call render', () => {
            expect(mockRouteConfig[4].render).not.toHaveBeenCalled();
          });
        });

        describe('and can enter route', () => {
          beforeEach(async () => {
            mockRouteConfig[4].enter?.mockReturnValue(true);
            await router.goto('/e');
            router.outlet();
          });

          it('should call render', () => {
            expect(mockRouteConfig[4].render).toHaveBeenCalled();
          });
        });
      });

      describe('and enter guard returns a boolean promise', () => {
        beforeEach(async () => {
          mockRouteConfig[4].enter = vi
            .fn()
            .mockReturnValue(new Promise((resolve) => resolve(false)));
          await router.goto('/e');
          router.outlet();
        });

        it('should call enter guard', () => {
          expect(mockRouteConfig[4].enter).toHaveBeenCalled();
        });

        describe('and cannot enter route', () => {
          it('should not call render', () => {
            expect(mockRouteConfig[4].render).not.toHaveBeenCalled();
          });
        });

        describe('and can enter route', () => {
          beforeEach(async () => {
            mockRouteConfig[4].enter?.mockReturnValue(
              new Promise((resolve) => resolve(true))
            );
            await router.goto('/e');
            router.outlet();
          });

          it('should call render', () => {
            expect(mockRouteConfig[4].render).toHaveBeenCalled();
          });
        });
      });
    });

    describe('when leaving a route with leave guard', () => {
      describe('and leave guard is a boolean', () => {
        beforeEach(async () => {
          mockRouteConfig[2].leave = vi.fn().mockReturnValue(false);
          await router.goto('/c');
          await router.goto('/a');
          router.outlet();
        });

        it('should call leave guard', () => {
          expect(mockRouteConfig[2].leave).toHaveBeenCalled();
        });

        describe('and cannot leave route', () => {
          it('should not call render', () => {
            expect(mockRouteConfig[0].render).not.toHaveBeenCalled();
          });
        });

        describe('and can leave route', () => {
          beforeEach(async () => {
            mockRouteConfig[2].leave?.mockReturnValue(true);
            await router.goto('/c');
            await router.goto('/a');
            router.outlet();
          });

          it('should call render', () => {
            expect(mockRouteConfig[0].render).toHaveBeenCalled();
          });
        });
      });

      describe('and leave guard is a boolean promise', () => {
        beforeEach(async () => {
          mockRouteConfig[2].leave = vi
            .fn()
            .mockReturnValue(new Promise((resolve) => resolve(false)));
          await router.goto('/c');
          await router.goto('/a');
          router.outlet();
        });

        it('should call leave guard', () => {
          expect(mockRouteConfig[2].leave).toHaveBeenCalled();
        });

        describe('and cannot leave route', () => {
          it('should not call render', () => {
            expect(mockRouteConfig[0].render).not.toHaveBeenCalled();
          });
        });

        describe('and can leave route', () => {
          beforeEach(async () => {
            mockRouteConfig[2].leave?.mockReturnValue(
              new Promise((resolve) => resolve(true))
            );
            await router.goto('/c');
            await router.goto('/a');
            router.outlet();
          });

          it('should call render', () => {
            expect(mockRouteConfig[0].render).toHaveBeenCalled();
          });
        });
      });

      describe('and leave guard is a boolean observable', () => {
        beforeEach(async () => {
          mockRouteConfig[2].leave = vi.fn().mockReturnValue(of(false));
          await router.goto('/c');
          await router.goto('/a');
          router.outlet();
        });

        it('should call leave guard', () => {
          expect(mockRouteConfig[2].leave).toHaveBeenCalled();
        });

        describe('and cannot leave route', () => {
          it('should not call render', () => {
            expect(mockRouteConfig[0].render).not.toHaveBeenCalled();
          });
        });

        describe('and can leave route', () => {
          beforeEach(async () => {
            mockRouteConfig[2].leave?.mockReturnValue(of(true));
            await router.goto('/c');
            await router.goto('/a');
            router.outlet();
          });

          it('should call render', () => {
            expect(mockRouteConfig[0].render).toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe('when navigating nested routes', () => {
    let element: MockParentRoute;
    const getChildRoute = () => {
      return element.shadowRoot?.querySelector(
        'mock-child-route'
      ) as MockChildRoute;
    };
    beforeEach(async () => {
      globalThis.location.pathname = '/d';
      mockRouterService.currentRoute.mockReturnValue(of(''));

      element = await fixture(html`<mock-parent-route></mock-parent-route>`);
      (element.shadowRoot?.getElementById('d') as HTMLAnchorElement).click();
    });

    it('should call mockRouterService', () => {
      expect(mockRouterService.go).toHaveBeenCalledWith('/d/def', {
        queryParams: { undefined: '' },
      });
    });

    it('should render', () => {
      expect(
        getChildRoute()?.shadowRoot?.querySelector('outlet')?.textContent
      ).toContain('Mock Route');
      expect(
        getChildRoute()?.shadowRoot?.querySelector('outlet')?.textContent
      ).toContain('def');
    });

    describe('and child link is clicked', () => {
      beforeEach(() => {
        (
          getChildRoute()?.shadowRoot?.getElementById(
            'abc'
          ) as HTMLAnchorElement
        ).click();
      });

      it('should call mockRouterService', () => {
        expect(mockRouterService.go).toHaveBeenCalledWith('/d/abc', {
          queryParams: { undefined: '' },
        });
      });

      it('should render child route', () => {
        expect(
          getChildRoute()?.shadowRoot?.querySelector('outlet')?.textContent
        ).toContain('abc');
      });
    });

    describe('when using router link', () => {
      describe('and no arguments are provided', () => {
        it('should generate root link', () => {
          expect(getChildRoute()._routes.link()).toBe('/d/def');
          expect(element._routes.link()).toBe('/d/');
        });
      });

      describe('and arguments are provided', () => {
        it('should generate appropriate link', () => {
          expect(getChildRoute()._routes.link('abc')).toBe('/d/abc');
          expect(element._routes.link('abc')).toBe('abc');
        });

        describe('and path is absolute', () => {
          it('should generate absolute path', () => {
            expect(getChildRoute()._routes.link('/abc')).toBe('/abc');
          });
        });
      });
    });
  });
});
