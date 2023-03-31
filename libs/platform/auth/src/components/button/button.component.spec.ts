import { fixture } from '@open-wc/testing-helpers';
import { AuthService } from '@spryker-oryx/auth';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { i18n } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { AuthButtonComponent } from './button.component';
import { authButtonComponent } from './button.def';

class MockAuthService implements Partial<AuthService> {
  logout = vi.fn().mockReturnValue(of(null));
  isAuthenticated = vi.fn().mockReturnValue(of(false));
}

class MockRouterService implements Partial<RouterService> {
  navigate = vi.fn();
}

describe('AuthButtonComponent', () => {
  let element: AuthButtonComponent;
  let authService: MockAuthService;
  let routerService: MockRouterService;

  const clickButton = (): void => {
    element.renderRoot
      .querySelector('button')
      ?.dispatchEvent(new MouseEvent('click'));
  };

  beforeAll(async () => {
    await useComponent(authButtonComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
      ],
    });

    authService = testInjector.inject(
      AuthService
    ) as unknown as MockAuthService;
    routerService = testInjector.inject(
      RouterService
    ) as unknown as MockRouterService;

    element = await fixture(html`<oryx-auth-button></oryx-auth-button>`);
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('when is not authenticated', () => {
    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should render login title', () => {
      expect(element.renderRoot.querySelector('button')?.textContent).toContain(
        i18n('auth.login')
      );
    });

    describe('and button is clicked', () => {
      beforeEach(() => {
        clickButton();
      });

      it('should navigate to login page', async () => {
        expect(routerService.navigate).toHaveBeenCalledWith('/login');
      });
    });
  });

  describe('when is authenticated', () => {
    beforeEach(async () => {
      authService.isAuthenticated = vi.fn().mockReturnValue(of(true));
      element = await fixture(html`<oryx-auth-button></oryx-auth-button>`);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should render logout title', () => {
      expect(element.renderRoot.querySelector('button')?.textContent).toContain(
        i18n('auth.logout')
      );
    });

    describe('and button is clicked', () => {
      beforeEach(() => {
        clickButton();
      });

      it('should emit the logout', async () => {
        expect(authService.logout).toHaveBeenCalled();
      });

      it('should redirect to default route', async () => {
        expect(routerService.navigate).toHaveBeenCalledWith('/');
      });

      describe('and custom redirect route is provided', () => {
        const logoutRedirectUrl = '/test';

        beforeEach(async () => {
          element = await fixture(html`<oryx-auth-button
            .options=${{ logoutRedirectUrl }}
          >
          </oryx-auth-button>`);
          clickButton();
        });

        it('should redirect to the route', async () => {
          expect(routerService.navigate).toHaveBeenCalledWith(
            logoutRedirectUrl
          );
        });
      });
    });
  });
});
