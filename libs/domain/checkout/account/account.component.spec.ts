import { fixture } from '@open-wc/testing-helpers';
import { AuthService } from '@spryker-oryx/auth';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { FormRenderer } from '@spryker-oryx/form';
import { RouterService } from '@spryker-oryx/router';
import { LinkService } from '@spryker-oryx/site';
import { User, UserService } from '@spryker-oryx/user';
import { html } from 'lit';
import { of } from 'rxjs';
import {
  CheckoutDataService,
  CheckoutService,
  CheckoutStateService,
} from '../src/services';
import { CheckoutAccountComponent } from './account.component';
import { checkoutAccountComponent } from './account.def';
import { CheckoutAccountComponentOptions } from './account.model';

export class MockCheckoutService implements Partial<CheckoutService> {
  getStatus = vi.fn().mockReturnValue(of());
}

export class MockCheckoutDataService implements Partial<CheckoutDataService> {
  get = vi.fn();
  set = vi.fn();
}

export class MockCheckoutStateService implements Partial<CheckoutStateService> {
  get = vi.fn();
  set = vi.fn();
  isInvalid = vi.fn().mockReturnValue(of(false));
}

class MockUserService implements Partial<UserService> {
  getUser = vi.fn();
}

class MockAuthService implements Partial<AuthService> {
  isAuthenticated = vi.fn();
}

export class MockSemanticLinkService implements Partial<LinkService> {
  get = vi.fn().mockReturnValue('/login');
}

export class MockRouterService implements Partial<RouterService> {
  navigate = vi.fn();
}

class MockFormRenderer implements Partial<FormRenderer> {
  buildForm = vi.fn();
}

describe('CheckoutAccountComponent', () => {
  let element: CheckoutAccountComponent;
  let authService: MockAuthService;
  let userService: MockUserService;
  let routerService: MockRouterService;
  let formRenderer: MockFormRenderer;
  let checkoutStateService: MockCheckoutDataService;

  beforeAll(async () => {
    await useComponent(checkoutAccountComponent);
  });

  beforeEach(() => {
    const injector = createInjector({
      providers: [
        { provide: CheckoutService, useClass: MockCheckoutService },
        { provide: CheckoutDataService, useClass: MockCheckoutDataService },
        { provide: CheckoutStateService, useClass: MockCheckoutStateService },
        { provide: RouterService, useClass: MockRouterService },
        { provide: LinkService, useClass: MockSemanticLinkService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: UserService, useClass: MockUserService },
        { provide: FormRenderer, useClass: MockFormRenderer },
      ],
    });

    authService = injector.inject<MockAuthService>(AuthService);
    userService = injector.inject<MockUserService>(UserService);
    routerService = injector.inject<MockRouterService>(RouterService);
    checkoutStateService =
      injector.inject<MockCheckoutStateService>(CheckoutStateService);
    formRenderer = injector.inject<MockFormRenderer>(FormRenderer);
    formRenderer.buildForm.mockReturnValue(
      html`<input type="email" name="email" placeholder="email" required />`
    );
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when the component is created', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-checkout-account></oryx-checkout-account>`
      );
    });

    it('should be an instance of ', () => {
      expect(element).toBeInstanceOf(CheckoutAccountComponent);
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe('when the user is authenticated', () => {
    const user = {
      firstName: 'Foo',
      lastName: 'Bar',
      email: 'foo@bar.com',
    } as User;

    beforeEach(async () => {
      authService.isAuthenticated.mockReturnValue(of(true));
      userService.getUser.mockReturnValue(of(user));
      element = await fixture(
        html`<oryx-checkout-account></oryx-checkout-account>`
      );
    });

    it('should render account header', () => {
      const header = element.renderRoot.querySelector(
        'oryx-checkout-header'
      )?.textContent;
      expect(header).toContain('Account');
    });

    it('should render the user data', () => {
      const customerData = element.renderRoot.querySelector('p')?.textContent;
      expect(customerData).toContain(`${user.firstName} ${user.lastName}`);
      expect(customerData).toContain(user.email);
    });

    it('should not render a link to login page', () => {
      expect(element).not.toContainElement(
        `oryx-checkout-header a[href='/login']`
      );
    });

    describe('and when the isValid method is called', () => {
      it('should return true', () => {
        expect(element.isValid(true)).toEqual(true);
      });
    });
  });

  describe('when the user is not authenticated', () => {
    beforeEach(async () => {
      authService.isAuthenticated.mockReturnValue(of(false));
      userService.getUser.mockReturnValue(of(null));
    });

    describe('and guest checkout is enabled', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-checkout-account
            .options=${{
              enableGuestCheckout: true,
            } as CheckoutAccountComponentOptions}
          ></oryx-checkout-account>`
        );
      });

      it('should render guest checkout header', () => {
        const header = element.renderRoot.querySelector(
          'oryx-checkout-header'
        )?.textContent;
        expect(header).toContain('Guest checkout');
      });

      it('should render a link to login page', () => {
        expect(element).toContainElement(
          `oryx-checkout-header a[href='/login']`
        );
      });

      describe('and the form data is changed', () => {
        let form: HTMLFormElement;
        beforeEach(async () => {
          form = element.renderRoot.querySelector('form') as HTMLFormElement;
          form.reportValidity = vi.fn();
        });

        describe('and the form data is invalid', () => {
          beforeEach(() => {
            const input = form?.querySelector('input') as HTMLInputElement;
            input.value = 'invalid';
            form?.dispatchEvent(new Event('change'));
          });

          it('should set the invalid customer state', () => {
            expect(checkoutStateService.set).toHaveBeenCalledWith('customer', {
              value: { email: 'invalid' },
              valid: false,
            });
          });

          describe('and isValid() is called', () => {
            beforeEach(() => {
              form.checkValidity = vi.fn();
            });

            describe('and the report argument is true', () => {
              beforeEach(async () => {
                element.isValid(true);
              });

              it('should call checkValidity', () => {
                expect(form.checkValidity).toHaveBeenCalled();
              });

              it('should report form validation', () => {
                expect(form.reportValidity).toHaveBeenCalled();
              });
            });

            describe('and the report argument is false', () => {
              beforeEach(async () => {
                element.isValid(false);
              });

              it('should call checkValidity', () => {
                expect(form.checkValidity).toHaveBeenCalled();
              });

              it('should not report form validation', () => {
                expect(form.reportValidity).not.toHaveBeenCalled();
              });
            });
          });
        });

        describe('and the form data is valid', () => {
          beforeEach(() => {
            const input = form?.querySelector('input') as HTMLInputElement;
            input.value = 'valid@mail.com';
            form?.dispatchEvent(new Event('change'));
          });

          it('should set the invalid customer state', () => {
            expect(checkoutStateService.set).toHaveBeenCalledWith('customer', {
              value: { email: 'valid@mail.com' },
              valid: true,
            });
          });

          describe('and isValid() is called', () => {
            beforeEach(() => {
              form.checkValidity = vi.fn();
            });

            describe('and the report argument is true', () => {
              beforeEach(async () => {
                element.isValid(true);
              });

              it('should call checkValidity', () => {
                expect(form.checkValidity).toHaveBeenCalled();
              });

              it('should report form validation', () => {
                expect(form.reportValidity).toHaveBeenCalled();
              });
            });

            describe('and the report argument is false', () => {
              beforeEach(async () => {
                element.isValid(false);
              });

              it('should call checkValidity', () => {
                expect(form.checkValidity).toHaveBeenCalled();
              });

              it('should not report form validation', () => {
                expect(form.reportValidity).not.toHaveBeenCalled();
              });
            });
          });
        });
      });
    });

    describe('and guest checkout is disabled', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-checkout-account
            .options=${{
              enableGuestCheckout: false,
            } as CheckoutAccountComponentOptions}
          ></oryx-checkout-account>`
        );
      });

      it('should not render guest checkout component', () => {
        expect(element).not.toContainElement('oryx-checkout-guest');
      });

      it('should redirect to the login page render the guest component', () => {
        expect(routerService.navigate).toHaveBeenCalledWith('/login');
      });
    });
  });
});
