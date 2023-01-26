import { fixture } from '@open-wc/testing-helpers';
import { AuthService } from '@spryker-oryx/auth';
import { CheckoutDataService, CheckoutService } from '@spryker-oryx/checkout';
import { CheckoutPlaceOrderComponent } from '@spryker-oryx/checkout/place-order';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { html } from 'lit';
import { of } from 'rxjs';
import { checkoutPlaceOrderComponent } from './place-order.def';

class MockCheckoutService implements Partial<CheckoutService> {
  placeOrder = vi.fn().mockReturnValue(of(null));
}

class MockCheckoutDataService implements Partial<CheckoutDataService> {
  isGuestCheckout = vi.fn().mockReturnValue(of(false));
}

class MockAuthService implements Partial<AuthService> {
  isAuthenticated = vi.fn().mockReturnValue(of(false));
}

describe('PlaceOrderComponent', () => {
  let element: CheckoutPlaceOrderComponent;
  let service: MockCheckoutService;
  let dataService: MockCheckoutDataService;
  let authService: MockAuthService;

  beforeAll(async () => {
    await useComponent(checkoutPlaceOrderComponent);
  });

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: CheckoutService,
          useClass: MockCheckoutService,
        },
        {
          provide: CheckoutDataService,
          useClass: MockCheckoutDataService,
        },
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
      ],
    });

    service = testInjector.inject(
      CheckoutService
    ) as unknown as MockCheckoutService;
    dataService = testInjector.inject(
      CheckoutDataService
    ) as unknown as MockCheckoutDataService;
    authService = testInjector.inject(
      AuthService
    ) as unknown as MockAuthService;
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('when type of checkout flow is not defined', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<checkout-place-order></checkout-place-order>`
      );
    });

    it('should not render the button', () => {
      expect(element).not.toContainElement('oryx-button');
    });
  });

  describe('when guest checkout flow', () => {
    beforeEach(async () => {
      dataService.isGuestCheckout.mockReturnValue(of(true));
      element = await fixture(
        html`<checkout-place-order></checkout-place-order>`
      );
    });

    it('should render the button', () => {
      expect(element).toContainElement('oryx-button');
    });
  });

  describe('when authorized checkout flow', () => {
    beforeEach(async () => {
      authService.isAuthenticated.mockReturnValue(of(true));
      element = await fixture(
        html`<checkout-place-order></checkout-place-order>`
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should render the button', () => {
      expect(element).toContainElement('oryx-button');
    });
  });

  describe('when button is clicked', () => {
    beforeEach(async () => {
      authService.isAuthenticated.mockReturnValue(of(true));
      element = await fixture(
        html`<checkout-place-order></checkout-place-order>`
      );
      element.shadowRoot?.querySelector('button')?.click();
    });

    it('should call CheckoutService.placeOrder', async () => {
      expect(service.placeOrder).toHaveBeenCalled();
    });
  });
});
