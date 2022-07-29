import { fixture, oneEvent } from '@open-wc/testing-helpers';
import { AuthService } from '@spryker-oryx/core';
import { ExperienceService, RouterService } from '@spryker-oryx/experience';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import '@spryker-oryx/testing';
import {
  PasswordInputComponent,
  PasswordVisibilityStrategy,
} from '@spryker-oryx/ui/password';
import { html } from 'lit';
import { of } from 'rxjs';
import '../index';
import { UserLoginComponent } from './login.component';

class MockExperienceService implements Partial<ExperienceService> {
  getOptions = vi.fn();
}

class MockAuthService implements Partial<AuthService> {
  login = vi.fn();
}

class MockSemanticLinkService implements Partial<SemanticLinkService> {
  get = vi.fn();
}

class MockRouterService implements Partial<RouterService> {
  back = vi.fn();
  navigate = vi.fn();
}

describe('User Login', () => {
  let element: UserLoginComponent;
  let authService: MockAuthService;
  let routerService: MockRouterService;
  let semanticLinkService: MockSemanticLinkService;

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
          provide: SemanticLinkService,
          useClass: MockSemanticLinkService,
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
    semanticLinkService = testInjector.inject(
      SemanticLinkService
    ) as unknown as MockSemanticLinkService;
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('default component', () => {
    beforeEach(async () => {
      element = await fixture(html`<user-login></user-login>`);
    });

    it('is defined', () => {
      expect(element).toBeInstanceOf(UserLoginComponent);
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
        html`<user-login
          .options="${{
            strategy: PasswordVisibilityStrategy.HOVER,
            remember: true,
          }}"
        ></user-login>`
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
        html`<user-login
          .options="${{
            strategy: PasswordVisibilityStrategy.HOVER,
            showRememberMe: true,
          }}"
        ></user-login>`
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
      const submit = element.shadowRoot?.querySelector(
        'button'
      ) as HTMLButtonElement;

      setTimeout(() => {
        submit.click();
      }, 0);

      await oneEvent(submit, 'click');
    };

    it('should call authService on login and disable login button', async () => {
      setupLogin();
      authService.login.mockReturnValue(of(true));

      await submit();
      expect(authService.login).toHaveBeenCalledWith(
        'email',
        'password',
        false
      );

      const submitButton = element.shadowRoot?.querySelector(
        'button'
      ) as HTMLButtonElement;
      expect(submitButton.disabled).toBe(true);
      expect(routerService.back).toHaveBeenCalled();
    });

    it('should remember login when checked', async () => {
      authService.login.mockReturnValue(of(true));
      setupLogin();
      const rememberme = element.shadowRoot?.querySelector(
        'input[name="rememberme"]'
      ) as HTMLInputElement;
      setTimeout(() => {
        rememberme.click();
      }, 0);

      await oneEvent(rememberme, 'click');
      await submit();
      expect(authService.login).toHaveBeenCalledWith('email', 'password', true);
    });

    it('should call semanticLink service for the unauthorized page when login fails', async () => {
      authService.login.mockReturnValue(of(false));
      semanticLinkService.get.mockReturnValue(of('/unauthorized'));
      setupLogin();

      await submit();

      expect(semanticLinkService.get).toHaveBeenCalledWith({
        type: SemanticLinkType.Page,
        id: 'unauthorized',
      });
    });

    it('should redirect to a specified url when logging in successfully', async () => {
      element = await fixture(
        html`<user-login
          .options="${{
            strategy: PasswordVisibilityStrategy.HOVER,
            showRememberMe: true,
            url: '/contact',
          }}"
        ></user-login>`
      );

      authService.login.mockReturnValue(of(true));
      setupLogin();

      await submit();

      expect(routerService.navigate).toHaveBeenCalledWith('/contact');
    });
  });
});
