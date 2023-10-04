import { fixture, nextFrame } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector, inject } from '@spryker-oryx/di';
import { ExperienceService } from '@spryker-oryx/experience';
import { FormFieldType, FormRenderer } from '@spryker-oryx/form';
import { I18nService } from '@spryker-oryx/i18n';
import { RouterService } from '@spryker-oryx/router';
import { passwordInputComponent } from '@spryker-oryx/ui';
import { PasswordVisibilityStrategy } from '@spryker-oryx/ui/password';
import { i18n, useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { EMPTY, of, throwError } from 'rxjs';
import { AuthLoginComponent } from './login.component';
import { authLoginComponent } from './login.def';
import { AuthLoginStrategy } from './login.strategy';

class MockExperienceService implements Partial<ExperienceService> {
  getOptions = vi.fn();
}

class MockRouterService implements Partial<RouterService> {
  back = vi.fn();
  navigate = vi.fn();
  previousRoute = vi.fn();
}

class MockI18NService implements Partial<I18nService> {
  translate = vi.fn().mockReturnValue(of('text'));
}

class MockAuthLoginStrategy implements AuthLoginStrategy {
  login = vi.fn().mockReturnValue(of(undefined));
}

class MockFormRenderer implements Partial<FormRenderer> {
  buildForm = vi.fn().mockReturnValue(html`
    <oryx-input>
      <input name="email" type="email" aria-label="label" />
    </oryx-input>
    <oryx-password-input>
      <input name="password" type="password" aria-label="label" />
    </oryx-password-input>
    <oryx-checkbox>
      <input name="rememberme" type="checkbox" aria-label="label" />
    </oryx-checkbox>
  `);
}

const defaultFields = [
  {
    id: 'email',
    type: FormFieldType.Email,
    required: true,
    label: i18n('user.login.email'),
    placeholder: i18n('user.login.email'),
    width: 100,
  },
  {
    id: 'password',
    type: FormFieldType.Password,
    required: true,
    label: i18n('user.login.password'),
    placeholder: i18n('user.login.password'),
    width: 100,
    attributes: {
      hasError: false,
      strategy: PasswordVisibilityStrategy.Click,
    },
  },
  {
    id: 'rememberme',
    type: FormFieldType.Boolean,
    label: i18n('user.login.remember-me'),
    width: 100,
  },
];

describe('AuthLoginComponent', () => {
  let element: AuthLoginComponent;
  let authLoginStrategy: MockAuthLoginStrategy;
  let routerService: MockRouterService;
  let renderer: MockFormRenderer;

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
          provide: RouterService,
          useClass: MockRouterService,
        },
        {
          provide: I18nService,
          useClass: MockI18NService,
        },
        {
          provide: MockAuthLoginStrategy,
          useClass: MockAuthLoginStrategy,
        },
        {
          provide: AuthLoginStrategy,
          useFactory: () => inject(MockAuthLoginStrategy),
        },
        {
          provide: FormRenderer,
          useClass: MockFormRenderer,
        },
      ],
    });

    renderer = testInjector.inject<MockFormRenderer>(FormRenderer);
    authLoginStrategy = testInjector.inject(MockAuthLoginStrategy);
    routerService = testInjector.inject(
      RouterService
    ) as unknown as MockRouterService;
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('when component is rendered', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-auth-login></oryx-auth-login>`);
    });

    it('should have a defined web component', () => {
      expect(element).toBeInstanceOf(AuthLoginComponent);
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should build a form', () => {
      expect(renderer.buildForm).toHaveBeenCalledWith(defaultFields);
    });
  });

  describe('when password visibility strategy is set to HOVER', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-auth-login
          .options="${{ passwordVisibility: PasswordVisibilityStrategy.Hover }}"
        ></oryx-auth-login>`
      );
    });

    it('should have the HOVER strategy for password visibility', () => {
      const expectedFields = defaultFields.map((field) => {
        if (field.id === 'password') {
          return {
            ...field,
            attributes: {
              ...field.attributes,
              strategy: PasswordVisibilityStrategy.Hover,
            },
          };
        }
        return field;
      });

      expect(renderer.buildForm).toBeCalledWith(expectedFields);
    });
  });

  describe('when the enableRememberMe property is set to false', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-auth-login
          .options="${{ enableRememberMe: false }}"
        ></oryx-auth-login>`
      );
    });

    it('should not pass checkbox to form builder', () => {
      const expectedFields = defaultFields.filter(
        (field) => field.id !== 'rememberme'
      );

      expect(renderer.buildForm).toBeCalledWith(expectedFields);
    });
  });

  describe('when login button is clicked', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-auth-login></oryx-auth-login>`);

      setupLogin();
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
      authLoginStrategy.login.mockReturnValue(EMPTY);

      const submitButton = element.shadowRoot?.querySelector(
        'button'
      ) as HTMLButtonElement;

      const observer = new MutationObserver((value) => {
        const submitButton = value[0].target as HTMLButtonElement;

        expect(submitButton.hasAttribute('disabled')).toBeTruthy();
        observer.disconnect();
      });

      observer.observe(submitButton, {
        attributeFilter: ['disabled'],
      });

      await submit();

      expect(authLoginStrategy.login).toHaveBeenCalledWith({
        email: 'email',
        password: 'password',
        rememberMe: false,
      });
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
          expect(authLoginStrategy.login).toHaveBeenCalledWith({
            email: 'email',
            password: 'password',
            rememberMe: true,
          });
        });
      });

      describe('when redirect url is not specified', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-auth-login
              .options="${{ redirectUrl: '' }}"
            ></oryx-auth-login>`
          );
        });

        it('should redirect to the last page', async () => {
          routerService.previousRoute.mockReturnValue(of('/previous'));
          await submit();
          expect(routerService.navigate).toHaveBeenCalledWith('/previous');
        });
      });

      describe('when redirect url is specified', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-auth-login
              .options="${{ redirectUrl: '/contact' }}"
            ></oryx-auth-login>`
          );
          setupLogin();
        });

        it('should redirect to the specified url', async () => {
          await submit();

          expect(routerService.navigate).toHaveBeenCalledWith('/contact');
        });
      });

      describe('when redirect was disabled', () => {
        it('should not redirect', async () => {
          element = await fixture(
            html`<oryx-auth-login
              .options="${{
                enableRedirect: false,
              }}"
            ></oryx-auth-login>`
          );
          await submit();

          expect(routerService.navigate).not.toHaveBeenCalled();
        });
      });
    });

    describe('when login fails', () => {
      beforeEach(() => {
        authLoginStrategy.login.mockReturnValue(
          throwError(() => new Error('Error'))
        );
        setupLogin();
      });

      it('should show error', async () => {
        expect(notification()).toBeNull();
        await submit();
        expect(notification()).not.toBeNull();
      });

      describe('and when a subsequent login happens', () => {
        beforeEach(async () => {
          await submit();
          await submit();
        });
        it('should attempt to login again', () => {
          expect(authLoginStrategy.login).toHaveBeenCalledTimes(2);
        });
      });
    });
  });
});
