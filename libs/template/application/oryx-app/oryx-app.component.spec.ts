import { fixture } from '@open-wc/testing-helpers';
import { mockCartProviders } from '@spryker-oryx/cart/mocks';
import { ContextService, DefaultContextService } from '@spryker-oryx/core';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { RouteParams, RouterService } from '@spryker-oryx/router';
import { LitRouter, RouteConfig } from '@spryker-oryx/router/lit';
import { siteProviders } from '@spryker-oryx/site';
import { ColorMode, useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SpyInstance } from 'vitest';
import { OryxAppComponent } from './oryx-app.component';
import { oryxAppComponent } from './oryx-app.def';

class MockRouterService implements Partial<RouterService> {
  private router$ = new BehaviorSubject('');
  private params$: Subject<RouteParams> = new Subject();

  go(route: string): void {
    this.router$.next(route);
  }
  currentRoute(): Observable<string> {
    return this.router$;
  }
  currentParams(): Observable<RouteParams> {
    return this.params$;
  }
  acceptParams(params: RouteParams): void {
    this.params$.next(params);
  }

  setRoutes(routes: RouteConfig[]): void {
    //
  }
}

describe('OryxAppComponent', () => {
  let element: OryxAppComponent;
  let routerService: MockRouterService;
  let litRouterOutletSpy: SpyInstance;

  beforeAll(async () => {
    await useComponent(oryxAppComponent);
  });

  beforeEach(async () => {
    createInjector({
      providers: [
        {
          provide: ContextService,
          useClass: DefaultContextService,
        },
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
        ...siteProviders,
        ...mockCartProviders,
      ],
    });

    routerService = getInjector().inject(
      RouterService
    ) as unknown as MockRouterService;
    routerService.go('/');

    litRouterOutletSpy = vi
      .spyOn(LitRouter.prototype, 'outlet')
      .mockReturnValue(html`mock-lit-router-outlet`);
  });

  afterEach(() => {
    destroyInjector();
  });

  it('should render `LitRouter.outlet()`', async () => {
    document.body.innerHTML = '<oryx-app></oryx-app>';

    await new Promise((res) => setTimeout(res));

    const oryxApp = document.querySelector('oryx-app');

    expect(oryxApp).toBeInstanceOf(HTMLElement);
    expect(oryxApp?.shadowRoot?.innerHTML).toContain('mock-lit-router-outlet');
  });

  describe(`when no colorMode option is set`, () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-app></oryx-app>`);
    });

    it('should not have the mode-light attribute', () => {
      expect(element.hasAttribute('mode-light')).toBe(false);
    });

    it('should not have the mode-dark attribute', () => {
      expect(element.hasAttribute('mode-dark')).toBe(false);
    });
  });

  describe(`when the colorMode option is set to ColorMode.Light`, () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-app .options=${{ colorMode: ColorMode.Light }}></oryx-app>`
      );
    });

    it('should add the mode-light attribute', async () => {
      expect(element.hasAttribute('mode-light')).toBe(true);
    });
  });

  describe(`when the colorMode option is set to ColorMode.Dark`, () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-app .options=${{ colorMode: ColorMode.Dark }}></oryx-app>`
      );
    });

    it('should add the mode-dark attribute', async () => {
      expect(element.hasAttribute('mode-dark')).toBe(true);
    });
  });
});
