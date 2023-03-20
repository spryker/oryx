import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { html } from 'lit';
import { of } from 'rxjs';
import { NavigateBackComponent } from './navigate-back.component';
import { navigateBackComponent } from './navigate-back.def';

class MockRouterService implements Partial<RouterService> {
  previousRoute = vi.fn().mockReturnValue(of(null));
}

describe('NavigateBackComponent', () => {
  let element: NavigateBackComponent;
  let routerService: MockRouterService;

  beforeAll(async () => {
    await useComponent(navigateBackComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
      ],
    });
    routerService = testInjector.inject(RouterService) as unknown as MockRouterService;
    element = await fixture(html`<oryx-navigate-back></oryx-navigate-back>`);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when there is no previousRoute', () => {
    it('should build default url', () => {
      expect(element).toContainElement('a[href="/"]');
    });

    describe('and fallbackUrl is provided', () => {
      const fallbackUrl = '/fallbackUrl';

      beforeEach(async () => {
        element = await fixture(html`<oryx-navigate-back
          .fallbackUrl=${fallbackUrl}
        ></oryx-navigate-back>`);
      });

      it('should build the url based on fallback url', () => {
        expect(element).toContainElement(`a[href="${fallbackUrl}"]`);
      });
    });
  });

  describe('when previousRoute is existed', () => {
    const previousRoute = '/previousRoute';

    beforeEach(async () => {
      routerService.previousRoute = vi.fn().mockReturnValue(of(previousRoute));
      element = await fixture(html`<oryx-navigate-back></oryx-navigate-back>`);
    });

    it('should build the url based on previous route', () => {
      expect(element).toContainElement(`a[href="${previousRoute}"]`);
    });
  });
});
