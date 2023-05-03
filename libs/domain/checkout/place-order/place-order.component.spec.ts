import { fixture } from '@open-wc/testing-helpers';
import { CartService } from '@spryker-oryx/cart';
import { CheckoutResponse, CheckoutService } from '@spryker-oryx/checkout';
import { CheckoutPlaceOrderComponent } from '@spryker-oryx/checkout/place-order';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { html } from 'lit';
import { of } from 'rxjs';
import { mockCheckoutProviders, MockCheckoutService } from '../src/mocks/src';
import { checkoutPlaceOrderComponent } from './place-order.def';

export class MockCartService implements Partial<CartService> {
  isEmpty = vi.fn().mockReturnValue(of(false));
}
export class MockRouterService implements Partial<RouterService> {
  navigate = vi.fn();
}

describe('PlaceOrderComponent', () => {
  let element: CheckoutPlaceOrderComponent;
  let service: MockCheckoutService;
  let routerService: MockRouterService;

  beforeAll(async () => {
    await useComponent(checkoutPlaceOrderComponent);
  });

  beforeEach(() => {
    const injector = createInjector({
      providers: [
        ...mockCheckoutProviders,
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

    service = injector.inject<MockCheckoutService>(CheckoutService);
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
      expect(service.placeOrder).toHaveBeenCalled();
    });

    describe('and a redirect is returned', () => {
      beforeEach(() => {
        service.placeOrder.mockReturnValue(
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
