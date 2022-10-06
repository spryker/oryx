import { fixture, nextFrame } from '@open-wc/testing-helpers';
import { AuthService } from '@spryker-oryx/auth';
import { useComponent } from '@spryker-oryx/core/utilities';
import { ExperienceService, RouterService } from '@spryker-oryx/experience';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import '@spryker-oryx/testing';
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

describe('Auth Login', () => {
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

  describe('default component', () => {
    beforeEach(async () => {
      element = await fixture(html`<auth-login></auth-login>`);
    });

    it('is defined', () => {
      expect(element).toBeInstanceOf(AuthLoginComponent);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('renders inputs', () => {
      expect(element?.shadowRoot?.querySelector('oryx-input')).toBeDefined();
    });

    it('renders click password strategy by default', () => {
      expect(
        (
          element?.shadowRoot?.querySelector(
            'oryx-password-input'
          ) as PasswordInputComponent
        ).strategy
      ).toBe('CLICK');
    });

    it('renders no remember me checkbox by default', () => {
      expect(element?.shadowRoot?.querySelector('oryx-checkbox')).toBeNull();
    });
  });

  describe('options', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<auth-login
          .options="${{
            strategy: PasswordVisibilityStrategy.HOVER,
            remember: true,
          }}"
        ></auth-login>`
      );
    });

    it('renders hover password strategy', () => {
      expect(
        (
          element?.shadowRoot?.querySelector(
            'oryx-password-input'
          ) as PasswordInputComponent
        ).strategy
      ).toBe('HOVER');
    });
    it('renders remember me checkbox', () => {
      expect(element?.shadowRoot?.querySelector('oryx-checkbox')).toBeDefined();
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<auth-login
          .options="${{
            strategy: PasswordVisibilityStrategy.HOVER,
            showRememberMe: true,
          }}"
        ></auth-login>`
      );
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

    it('should call authService on login and disable login button', async () => {
      setupLogin();
      authService.login.mockReturnValue(of(true));
      routerService.previousRoute.mockReturnValue(of(null));

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

    it('should redirect to home page when there is no browsing history', async () => {
      setupLogin();
      authService.login.mockReturnValue(of(true));
      routerService.previousRoute.mockReturnValue(of(null));

      await submit();

      expect(routerService.navigate).toHaveBeenCalledWith('/');
    });

    it('should remember login when checked', async () => {
      authService.login.mockReturnValue(of(true));
      routerService.previousRoute.mockReturnValue(of(null));
      setupLogin();
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

    it('should show error when login fails', async () => {
      authService.login.mockReturnValue(throwError(() => new Error('Error')));
      setupLogin();

      expect(notification()).toBeNull();

      await submit();

      expect(notification()).not.toBeNull();
    });

    it('should redirect to the last page when successfully logging in without redirect url specified', async () => {
      authService.login.mockReturnValue(of(true));
      routerService.previousRoute.mockReturnValue(of('/previous'));
      setupLogin();

      await submit();

      expect(routerService.navigate).toHaveBeenCalledWith('/previous');
    });

    it('should redirect to a specified url when logging in successfully', async () => {
      element = await fixture(
        html`<auth-login
          .options="${{
            strategy: PasswordVisibilityStrategy.HOVER,
            showRememberMe: true,
            url: '/contact',
          }}"
        ></auth-login>`
      );

      authService.login.mockReturnValue(of(true));
      setupLogin();

      await submit();

      expect(routerService.navigate).toHaveBeenCalledWith('/contact');
    });
  });
});
