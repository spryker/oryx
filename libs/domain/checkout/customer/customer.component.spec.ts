import { fixture } from '@open-wc/testing-helpers';
import { AuthService } from '@spryker-oryx/auth';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { SemanticLinkService } from '@spryker-oryx/site';
import { User, UserService } from '@spryker-oryx/user';
import { html } from 'lit';
import { of } from 'rxjs';
import {
  CheckoutDataService,
  CheckoutService,
  CheckoutStateService,
} from '../src/services';
import { CheckoutCustomerComponent } from './customer.component';
import { checkoutCustomerComponent } from './customer.def';
import { CheckoutAuthComponentOptions } from './customer.model';

export class MockCheckoutService implements Partial<CheckoutService> {
  getProcessState = vi.fn().mockReturnValue(of());
}

export class MockCheckoutDataService implements Partial<CheckoutDataService> {
  get = vi.fn();
}

export class MockCheckoutStateService implements Partial<CheckoutStateService> {
  get = vi.fn();
  set = vi.fn();
}

class MockUserService implements Partial<UserService> {
  getUser = vi.fn();
}

class MockAuthService implements Partial<AuthService> {
  isAuthenticated = vi.fn();
}

export class MockSemanticLinkService implements Partial<SemanticLinkService> {
  get = vi.fn().mockReturnValue('/login');
}

export class MockRouterService implements Partial<RouterService> {
  navigate = vi.fn();
}

describe('CheckoutAuthComponent', () => {
  let element: CheckoutCustomerComponent;
  let authService: MockAuthService;
  let checkoutService: MockCheckoutService;
  let userService: MockUserService;
  let routerService: MockRouterService;

  beforeAll(async () => {
    await useComponent(checkoutCustomerComponent);
  });

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        { provide: CheckoutService, useClass: MockCheckoutService },
        { provide: CheckoutDataService, useClass: MockCheckoutDataService },
        { provide: CheckoutStateService, useClass: MockCheckoutStateService },
        { provide: RouterService, useClass: MockRouterService },
        { provide: SemanticLinkService, useClass: MockSemanticLinkService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: UserService, useClass: MockUserService },
      ],
    });

    authService = testInjector.inject<MockAuthService>(AuthService);
    userService = testInjector.inject<MockUserService>(UserService);
    routerService = testInjector.inject<MockRouterService>(RouterService);
    checkoutService = testInjector.inject<MockCheckoutService>(CheckoutService);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when the component is created', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-checkout-customer></oryx-checkout-customer>`
      );
    });

    it('should be an instance of ', () => {
      expect(element).toBeInstanceOf(CheckoutCustomerComponent);
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe('when the user is authenticated', () => {
    beforeEach(async () => {
      authService.isAuthenticated.mockReturnValue(of(true));
      userService.getUser.mockReturnValue(of({ email: 'foo@bar.com' } as User));
      element = await fixture(
        html`<oryx-checkout-customer></oryx-checkout-customer>`
      );
    });

    it('should render the heading', () => {
      const h1 = element.renderRoot.querySelector('h1');
      expect(h1?.textContent).toBe('Checkout');
    });

    it('should not render the guest component', () => {
      expect(element).not.toContainElement('oryx-checkout-customer');
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
          html`<oryx-checkout-customer
            .options=${{
              enableGuestCheckout: true,
            } as CheckoutAuthComponentOptions}
          ></oryx-checkout-customer>`
        );
      });

      it('should render guest checkout component', () => {
        expect(element).toContainElement('oryx-checkout-guest');
      });
    });

    describe('and guest checkout is disabled', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-checkout-customer
            .options=${{
              enableGuestCheckout: false,
            } as CheckoutAuthComponentOptions}
          ></oryx-checkout-customer>`
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
