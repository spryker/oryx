import { fixture } from '@open-wc/testing-helpers';
import { CartService } from '@spryker-oryx/cart';
import {
  CheckoutDataService,
  CheckoutResponse,
  CheckoutService,
  CheckoutStateService,
  CheckoutStatus,
} from '@spryker-oryx/checkout';
import { CheckoutPlaceOrderComponent } from '@spryker-oryx/checkout/place-order';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { html } from 'lit';
import { of } from 'rxjs';
import { checkoutPlaceOrderComponent } from './place-order.def';

export class MockCartService implements Partial<CartService> {
  isEmpty = vi.fn().mockReturnValue(of(false));
}

export class MockRouterService implements Partial<RouterService> {
  navigate = vi.fn();
}

export class MockCheckoutService implements Partial<CheckoutService> {
  getStatus = vi.fn().mockReturnValue(of());
  placeOrder = vi.fn().mockReturnValue(of());
}

export class MockCheckoutDataService implements Partial<CheckoutDataService> {
  get = vi.fn();
}

export class MockCheckoutStateService implements Partial<CheckoutStateService> {
  get = vi.fn();
  set = vi.fn();
  isInvalid = vi.fn().mockReturnValue(of(false));
}

describe('PlaceOrderComponent', () => {
  let element: CheckoutPlaceOrderComponent;
  let checkoutService: MockCheckoutService;
  let routerService: MockRouterService;

  beforeAll(async () => {
    await useComponent(checkoutPlaceOrderComponent);
  });

  beforeEach(() => {
    const injector = createInjector({
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
          provide: CheckoutStateService,
          useClass: MockCheckoutStateService,
        },
        {
          provide: CartService,
          useClass: MockCartService,
        },
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
      ],
    });

    checkoutService = injector.inject<MockCheckoutService>(CheckoutService);
    checkoutService = injector.inject<MockCheckoutService>(CheckoutService);
    routerService = injector.inject<MockRouterService>(RouterService);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when the checkout process is not ready', () => {
    beforeEach(async () => {
      checkoutService.getStatus.mockReturnValue(of(CheckoutStatus.Empty));
      element = await fixture(
        html`<oryx-checkout-place-order></oryx-checkout-place-order>`
      );
    });

    it('should not render the place order button', () => {
      expect(element).not.toContainElement('oryx-button');
    });
  });

  describe('when the checkout process is ready', () => {
    beforeEach(async () => {
      checkoutService.getStatus.mockReturnValue(of(CheckoutStatus.Ready));
      element = await fixture(
        html`<oryx-checkout-place-order></oryx-checkout-place-order>`
      );
      element.renderRoot.querySelector('button')?.click();
    });

    it('should render the place order button', () => {
      expect(element).toContainElement('oryx-button');
    });

    it('should not render the loading attribute', () => {
      expect(element).not.toContainElement('oryx-button[loading]');
    });

    it('should not set the inert state on the button', () => {
      expect(element).not.toContainElement('oryx-button[inert]');
    });

    describe('and the button is clicked', () => {
      beforeEach(async () => {
        element.renderRoot.querySelector('button')?.click();
      });

      it('should call CheckoutService.placeOrder', () => {
        expect(checkoutService.placeOrder).toHaveBeenCalled();
      });

      describe('and when a redirect is returned', () => {
        beforeEach(() => {
          checkoutService.placeOrder.mockReturnValue(
            of({ redirectUrl: 'http://foo.com/bar' } as CheckoutResponse)
          );
          element.renderRoot.querySelector('button')?.click();
        });

        it('should navigate to the redirect route', () => {
          expect(routerService.navigate).toHaveBeenCalledWith(
            'http://foo.com/bar'
          );
        });
      });

      describe('and when no redirect is returned', () => {
        beforeEach(() => {
          checkoutService.placeOrder.mockReturnValue(
            of({} as CheckoutResponse)
          );
          element.renderRoot.querySelector('button')?.click();
        });

        it('should not navigate to the redirect route', () => {
          expect(routerService.navigate).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('when the checkout process is busy', () => {
    beforeEach(async () => {
      checkoutService.getStatus.mockReturnValue(of(CheckoutStatus.Busy));
      element = await fixture(
        html`<oryx-checkout-place-order></oryx-checkout-place-order>`
      );
    });

    it('should render a loading button', () => {
      expect(element).toContainElement('oryx-button[loading]');
    });

    it('should set the inert state on the button', () => {
      expect(element).toContainElement('oryx-button[inert]');
    });
  });
});
