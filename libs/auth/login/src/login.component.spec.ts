import { fixture, nextFrame } from '@open-wc/testing-helpers';
import { AuthService } from '@spryker-oryx/auth';
import { useComponent } from '@spryker-oryx/core/utilities';
import { ExperienceService, RouterService } from '@spryker-oryx/experience';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import {
  PasswordInputComponent,
  passwordInputComponent,
  PasswordVisibilityStrategy,
} from '@spryker-oryx/ui/password';
import { html } from 'lit';
import { of, throwError } from 'rxjs';
import { authLoginComponent } from './component';
import { AuthLoginComponent } from './login.component';

class MockExperienceService implements Partial<ExperienceService> {
  getOptions = vi.fn();
}

class MockAuthService implements Partial<AuthService> {
  login = vi.fn();
}

class MockRouterService implements Partial<RouterService> {
  back = vi.fn();
  navigate = vi.fn();
  previousRoute = vi.fn();
}

describe('AuthLoginComponent', () => {
  let element: AuthLoginComponent;
  let authService: MockAuthService;
  let routerService: MockRouterService;

  beforeAll(async () => {
    await useComponent([authLoginComponent, passwordInputComponent]);
  });

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: ExperienceService,
          useClass: MockExperienceService,
        },
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
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('when component is rendered', () => {
    beforeEach(async () => {
      element = await fixture(html`<auth-login></auth-login>`);
    });

    it('should have a defined web component', () => {
      expect(element).toBeInstanceOf(AuthLoginComponent);
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should render an oryx-input in the light dom', () => {
      expect(element?.shadowRoot?.querySelector('oryx-input')).toBeDefined();
    });

    it('should have the CLICK strategy for password visibility', () => {
      expect(
        (
          element?.shadowRoot?.querySelector(
            'oryx-password-input'
          ) as PasswordInputComponent
        ).strategy
      ).toBe('CLICK');
    });

    it('should not have a remember me checkbox', () => {
      expect(element?.shadowRoot?.querySelector('oryx-checkbox')).toBeNull();
    });
  });

  describe('when password visibility strategy is set to HOVER', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<auth-login
          .options="${{ strategy: PasswordVisibilityStrategy.HOVER }}"
        ></auth-login>`
      );
    });

    it('should have the HOVER strategy for password visibility', () => {
      expect(
        (
          element?.shadowRoot?.querySelector(
            'oryx-password-input'
          ) as PasswordInputComponent
        ).strategy
      ).toBe('HOVER');
    });
  });

  describe('when the remember property is set to true', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<auth-login .options="${{ remember: true }}"></auth-login>`
      );
    });

    it('should have a checkbox for remember me', () => {
      expect(element?.shadowRoot?.querySelector('oryx-checkbox')).toBeDefined();
    });
  });

  describe('when login button is clicked', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<auth-login
          .options="${{
            showRememberMe: true,
          }}"
        ></auth-login>`
      );

      setupLogin();
      authService.login.mockReturnValue(of(true));
      routerService.previousRoute.mockReturnValue(of(null));
    });

    const setupLogin = (): void => {
      const shadowRoot = element.shadowRoot;
      const email = shadowRoot?.querySelector(
        'input[name="email"]'
      ) as HTMLInputElement;
      const password = shadowRoot?.querySelector(
        'input[name="password"]'
      ) as HTMLInputElement;

      email.value = 'email';
      password.value = 'password';
    };

    const submit = async (): Promise<void> => {
      element.shadowRoot?.querySelector('form')?.submit();
      await nextFrame();
    };

    const notification = (): HTMLElement | null => {
      return element.shadowRoot?.querySelector('oryx-notification') ?? null;
    };

    it('should call authService and disable login button', async () => {
      const mutation = vi.fn();

      const observer = new MutationObserver(mutation);
      const submitButton = element.shadowRoot?.querySelector(
        'button'
      ) as HTMLButtonElement;

      observer.observe(submitButton, {
        attributes: true,
        attributeFilter: ['disabled'],
      });

      await submit();
      expect(authService.login).toHaveBeenCalledWith({
        password: 'password',
        username: 'email',
        remember: false,
      });

      expect(mutation).toHaveBeenCalled();
    });

    describe('when login succeeds', () => {
      describe('and there is no browsing history', () => {
        it('should redirect to home page', async () => {
          await submit();
          expect(routerService.navigate).toHaveBeenCalledWith('/');
        });
      });

      describe('when remember me is checked', () => {
        it('should remember login when checked', async () => {
          const rememberMe = element.shadowRoot?.querySelector(
            'input[name="rememberme"]'
          ) as HTMLInputElement;
          rememberMe.click();
          await submit();
          expect(authService.login).toHaveBeenCalledWith({
            password: 'password',
            username: 'email',
            remember: true,
          });
        });
      });

      describe('when redirect url is not specified', () => {
        it('should redirect to the last page', async () => {
          routerService.previousRoute.mockReturnValue(of('/previous'));
          await submit();
          expect(routerService.navigate).toHaveBeenCalledWith('/previous');
        });
      });

      describe('when redirect url is specified', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<auth-login
              .options="${{
                strategy: PasswordVisibilityStrategy.HOVER,
                showRememberMe: true,
                url: '/contact',
              }}"
            ></auth-login>`
          );
        });

        it('should redirect to the specified url', async () => {
          await submit();
          expect(routerService.navigate).toHaveBeenCalledWith('/contact');
        });
      });
    });

    describe('when login fails', () => {
      beforeEach(() => {
        authService.login.mockReturnValue(throwError(() => new Error('Error')));
        setupLogin();
      });

      it('should show error', async () => {
        expect(notification()).toBeNull();
        await submit();
        expect(notification()).not.toBeNull();
      });

      describe('and when a subsequent login happens', () => {
        it('should attempt to login again', async () => {
          await submit();
          expect(authService.login).toHaveBeenCalled();
        });
      });
    });
  });
});
