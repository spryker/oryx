import { fixture } from '@open-wc/testing-helpers';
import { CheckoutService } from '@spryker-oryx/checkout';
import { CheckoutPlaceOrderComponent } from '@spryker-oryx/checkout/place-order';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { html } from 'lit';
import { mockCheckoutProviders } from '../../src/mocks/src';
import { MockCheckoutService } from '../../src/mocks/src/mock-checkout.service';
import { checkoutPlaceOrderComponent } from './place-order.def';

describe('PlaceOrderComponent', () => {
  let element: CheckoutPlaceOrderComponent;
  let service: MockCheckoutService;

  beforeAll(async () => {
    await useComponent(checkoutPlaceOrderComponent);
  });

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [...mockCheckoutProviders],
    });

    service = testInjector.inject<MockCheckoutService>(CheckoutService);
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
      element.shadowRoot?.querySelector('button')?.click();
    });

    it('should call CheckoutService.placeOrder', async () => {
      expect(service.placeOrder).toHaveBeenCalled();
    });
  });
});
