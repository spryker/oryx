import { fixture } from '@open-wc/testing-helpers';
import { AuthService } from '@spryker-oryx/auth';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { i18n, useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { LoginLinkComponent } from './login-link.component';
import { loginLinkComponent } from './login-link.def';

class MockAuthService implements Partial<AuthService> {
  logout = vi.fn().mockReturnValue(of(null));
  isAuthenticated = vi.fn().mockReturnValue(of(false));
}

class MockRouterService implements Partial<RouterService> {
  navigate = vi.fn();
}

describe('LoginLinkComponent', () => {
  let element: LoginLinkComponent;
  let authService: MockAuthService;
  let routerService: MockRouterService;

  const clickOption = (): void => {
    element.renderRoot.querySelector<HTMLElement>('oryx-option')?.click();
  };

  beforeAll(async () => {
    await useComponent(loginLinkComponent);
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

    element = await fixture(
      html`<oryx-auth-login-link></oryx-auth-login-link>`
    );
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('when is not authenticated', () => {
    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should render login title', () => {
      const link = element.renderRoot.querySelector('oryx-option') as any;
      expect(link.innerText.trim()).toBe(i18n('auth.login'));
    });

    describe('and link is clicked', () => {
      beforeEach(() => {
        clickOption();
      });

      it('should navigate to login page', () => {
        expect(routerService.navigate).toHaveBeenCalledWith('/login');
      });
    });
  });

  describe('when is authenticated', () => {
    beforeEach(async () => {
      authService.isAuthenticated = vi.fn().mockReturnValue(of(true));
      element = await fixture(
        html`<oryx-auth-login-link></oryx-auth-login-link>`
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should render logout title', () => {
      const link = element.renderRoot.querySelector('oryx-option') as any;
      expect(link.innerText.trim()).toBe(i18n('auth.logout'));
    });

    describe('and logout is not enabled', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-auth-login-link
          .options=${{ enableLogout: false }}
        >
        </oryx-auth-login-link>`);
      });

      it('should not render the link', () => {
        expect(element).not.toContainElement('oryx-option');
      });
    });

    describe('and link is clicked', () => {
      beforeEach(() => {
        clickOption();
      });

      it('should emit the logout', () => {
        expect(authService.logout).toHaveBeenCalled();
      });

      it('should redirect to default route', () => {
        expect(routerService.navigate).toHaveBeenCalledWith('/');
      });

      describe('and custom redirect route is provided', () => {
        const logoutRedirectUrl = '/test';

        beforeEach(async () => {
          element = await fixture(html`<oryx-auth-login-link
            .options=${{ logoutRedirectUrl }}
          >
          </oryx-auth-login-link>`);
          clickOption();
        });

        it('should redirect to the route', () => {
          expect(routerService.navigate).toHaveBeenCalledWith(
            logoutRedirectUrl
          );
        });
      });
    });
  });
});
