import { fixture } from '@open-wc/testing-helpers';
import { AuthService } from '@spryker-oryx/auth';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { User, UserService } from '@spryker-oryx/user';
import { html } from 'lit';
import { Observable, of, take } from 'rxjs';
import { CheckoutGuestComponent } from '../guest';
import { mockCheckoutProviders, MockCheckoutService } from '../src/mocks/src';
import { CheckoutService } from '../src/services';
import { CheckoutAuthComponent } from './auth.component';
import { checkoutAuthComponent } from './auth.def';

class MockUserService implements Partial<UserService> {
  getUser = vi.fn();
}

class MockAuthService implements Partial<AuthService> {
  isAuthenticated = vi.fn();
}

describe('CheckoutAuthComponent', () => {
  let element: CheckoutAuthComponent;
  let authService: MockAuthService;
  let checkoutService: MockCheckoutService;
  let userService: MockUserService;
  let callback: () => Observable<unknown>;

  beforeAll(async () => {
    await useComponent(checkoutAuthComponent);
  });

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        ...mockCheckoutProviders,
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
        {
          provide: UserService,
          useClass: MockUserService,
        },
      ],
    });

    authService = testInjector.inject<MockAuthService>(AuthService);
    userService = testInjector.inject<MockUserService>(UserService);
    checkoutService = testInjector.inject<MockCheckoutService>(CheckoutService);
    checkoutService.register.mockImplementation((param, fn) => (callback = fn));
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when the component is created', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-checkout-auth></oryx-checkout-auth>`);
    });

    it('should be an instance of ', () => {
      expect(element).toBeInstanceOf(CheckoutAuthComponent);
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should register the step at the checkout service', () => {
      expect(checkoutService.register).toHaveBeenCalledWith(
        'customer',
        expect.anything(),
        1
      );
    });
  });

  describe('when the user is authenticated', () => {
    beforeEach(async () => {
      authService.isAuthenticated.mockReturnValue(of(true));
      userService.getUser.mockReturnValue(of({ email: 'foo@bar.com' } as User));
      element = await fixture(html`<oryx-checkout-auth></oryx-checkout-auth>`);
    });

    it('should not render the guest component', () => {
      expect(element).not.toContainElement('oryx-checkout-guest');
    });

    describe('and when the collect callback is called', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-checkout-auth></oryx-checkout-auth>`
        );
        callback().pipe(take(1)).subscribe();
      });
      it('should collect the data', () => {
        expect(userService.getUser).toHaveBeenCalled();
      });
    });
  });

  describe('when the user is not authenticated', () => {
    beforeEach(async () => {
      authService.isAuthenticated.mockReturnValue(of(false));
      userService.getUser.mockReturnValue(of(null));
      element = await fixture(html`<oryx-checkout-auth></oryx-checkout-auth>`);
    });

    it('should render the guest component', () => {
      expect(element).toContainElement('oryx-checkout-guest');
    });

    describe('and the collect callback is called', () => {
      let guestComponent: CheckoutGuestComponent;
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-checkout-auth></oryx-checkout-auth>`
        );
        guestComponent = element.shadowRoot?.querySelector(
          'oryx-checkout-guest'
        ) as CheckoutGuestComponent;
        guestComponent.collectData = vi.fn();
        callback().pipe(take(1)).subscribe();
      });
      it('should collect the data', () => {
        expect(guestComponent.collectData).toHaveBeenCalled();
      });
    });
  });
});
