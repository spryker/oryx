import { fixture } from '@open-wc/testing-helpers';
import { AuthService, logoutLinkComponent } from '@spryker-oryx/auth';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { LogoutLinkComponent } from './logout-link.component';

class MockAuthService implements Partial<AuthService> {
  logout = vi.fn().mockReturnValue(of(null));
  isAuthenticated = vi.fn().mockReturnValue(of(false));
}

class MockRouterService implements Partial<RouterService> {
  navigate = vi.fn();
}

describe('LogoutLinkComponent', () => {
  let element: LogoutLinkComponent;
  let authService: MockAuthService;
  let routerService: MockRouterService;

  const clickButton = (): void => {
    element.renderRoot.querySelector<HTMLElement>('oryx-content-link')?.click();
  };

  beforeAll(async () => {
    await useComponent(logoutLinkComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: RouterService, useClass: MockRouterService },
      ],
    });
    authService = testInjector.inject<MockAuthService>(AuthService);
    routerService = testInjector.inject<MockRouterService>(RouterService);
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('when is not authenticated', () => {
    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should not render anything', () => {
      expect(element).not.toContainElement('*');
    });
  });

  describe.only('when is authenticated', () => {
    beforeEach(async () => {
      authService.isAuthenticated = vi.fn().mockReturnValue(of(true));
      element = await fixture(
        html`<oryx-auth-logout-link></oryx-auth-logout-link>`
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    describe('and link is clicked', () => {
      beforeEach(() => {
        clickButton();
      });

      it('should emit the logout', () => {
        expect(authService.logout).toHaveBeenCalled();
      });

      describe('and redirect route is not provided', () => {
        beforeEach(async () => {
          clickButton();
        });

        it('should redirect to the route', () => {
          expect(routerService.navigate).not.toHaveBeenCalled();
        });
      });

      describe('and redirect route is provided', () => {
        const redirectUrl = '/test';

        beforeEach(async () => {
          element = await fixture(html`<oryx-auth-logout-link
            .options=${{ redirectUrl }}
          >
          </oryx-auth-logout-link>`);
          clickButton();
        });

        it('should redirect to the route', () => {
          expect(routerService.navigate).toHaveBeenCalledWith(redirectUrl);
        });
      });
    });
  });
});
