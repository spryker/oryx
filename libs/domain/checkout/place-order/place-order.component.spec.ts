import { fixture } from '@open-wc/testing-helpers';
import { CartService } from '@spryker-oryx/cart';
import {
  CheckoutDataService,
  CheckoutResponse,
  CheckoutService,
  CheckoutState,
  CheckoutStateService,
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
  getProcessState = vi.fn().mockReturnValue(of());
  placeOrder = vi.fn().mockReturnValue(of());
}

export class MockCheckoutDataService implements Partial<CheckoutDataService> {
  get = vi.fn();
}

export class MockCheckoutStateService implements Partial<CheckoutStateService> {
  get = vi.fn();
  set = vi.fn();
}

describe('PlaceOrderComponent', () => {
  let element: CheckoutPlaceOrderComponent;
  let checkoutService: MockCheckoutService;
  let checkoutDataService: MockCheckoutDataService;
  let checkoutStateService: MockCheckoutStateService;
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
    checkoutDataService =
      injector.inject<MockCheckoutDataService>(CheckoutDataService);
    checkoutStateService =
      injector.inject<MockCheckoutStateService>(CheckoutStateService);
    routerService = injector.inject<MockRouterService>(RouterService);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when button is clicked', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-checkout-place-order></oryx-checkout-place-order>`
      );
      element.renderRoot.querySelector('button')?.click();
    });

    it('should call CheckoutService.placeOrder', () => {
      expect(checkoutService.placeOrder).toHaveBeenCalled();
    });

    describe('and a redirect is returned', () => {
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
  });
});
