import { fixture } from '@open-wc/testing-helpers';
import { AuthService } from '@spryker-oryx/auth';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { SemanticLinkService } from '@spryker-oryx/site';
import { User, UserService } from '@spryker-oryx/user';
import { html } from 'lit';
import { Observable, of, take } from 'rxjs';
import { CheckoutGuestComponent } from '../guest';
import { CheckoutState } from '../src/models';
import { CheckoutService } from '../src/services';
import { CheckoutCustomerComponent } from './customer.component';
import { checkoutCustomerComponent } from './customer.def';
import { CheckoutAuthComponentOptions } from './customer.model';

class MockUserService implements Partial<UserService> {
  getUser = vi.fn();
}

class MockAuthService implements Partial<AuthService> {
  isAuthenticated = vi.fn();
}

export class MockSemanticLinkService implements Partial<SemanticLinkService> {
  get = vi.fn();
}

export class MockRouterService implements Partial<RouterService> {
  navigate = vi.fn();
}

export class MockCheckoutService implements Partial<CheckoutService> {
  register = vi.fn();
  getState = vi.fn().mockReturnValue(of(CheckoutState.Initializing));
}

describe('CheckoutAuthComponent', () => {
  let element: CheckoutCustomerComponent;
  let authService: MockAuthService;
  let checkoutService: MockCheckoutService;
  let userService: MockUserService;
  let routerService: MockRouterService;
  let linkService: MockSemanticLinkService;
  let callback: () => Observable<unknown>;

  beforeAll(async () => {
    await useComponent(checkoutCustomerComponent);
  });

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: CheckoutService,
          useClass: MockCheckoutService,
        },
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
        {
          provide: SemanticLinkService,
          useClass: MockSemanticLinkService,
        },
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
    routerService = testInjector.inject<MockRouterService>(RouterService);
    linkService =
      testInjector.inject<MockSemanticLinkService>(SemanticLinkService);
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
      expect(element).toBeInstanceOf(CheckoutCustomerComponent);
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

    it('should render the heading', () => {
      const h1 = element.renderRoot.querySelector('h1');
      expect(h1?.textContent).toBe('Checkout');
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

    describe('and guest checkout is not provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-checkout-auth></oryx-checkout-auth>`
        );
      });

      it('should render the guest component', () => {
        expect(element).toContainElement('oryx-checkout-guest');
      });
    });

    describe('and guest checkout is enabled', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-checkout-auth
            .options=${{
              enableGuestCheckout: true,
            } as CheckoutAuthComponentOptions}
          ></oryx-checkout-auth>`
        );
      });

      it('should render the guest component', () => {
        expect(element).toContainElement('oryx-checkout-guest');
      });
    });

    describe('and guest checkout is disabled', () => {
      beforeEach(async () => {
        linkService.get.mockReturnValue('/login');
        element = await fixture(
          html`<oryx-checkout-auth
            .options=${{
              enableGuestCheckout: false,
            } as CheckoutAuthComponentOptions}
          ></oryx-checkout-auth>`
        );
      });

      it('should not render the guest component', () => {
        expect(element).not.toContainElement('oryx-checkout-guest');
      });

      it.only('should redirect to the login page render the guest component', () => {
        expect(routerService.navigate).toHaveBeenCalledWith('/login');
      });
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
