import { fixture } from '@open-wc/testing-helpers';
import { CheckoutService } from '@spryker-oryx/checkout';
import { CheckoutPlaceOrderComponent } from '@spryker-oryx/checkout/place-order';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { html } from 'lit';
import { checkoutPlaceOrderComponent } from './place-order.def';

class MockCheckoutService implements Partial<CheckoutService> {
  placeOrder = vi.fn();
}

describe('PlaceOrderComponent', () => {
  let element: CheckoutPlaceOrderComponent;
  let service: MockCheckoutService;

  beforeAll(async () => {
    await useComponent(checkoutPlaceOrderComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: CheckoutService,
          useClass: MockCheckoutService,
        },
      ],
    });

    service = testInjector.inject(
      CheckoutService
    ) as unknown as MockCheckoutService;
    element = await fixture(
      html`<checkout-place-order></checkout-place-order>`
    );
  });

  afterEach(() => {
    destroyInjector();
  });

  it('should render the button', () => {
    expect(element).toContainElement('oryx-button');
  });

  it('should call CheckoutService.placeOrder', async () => {
    const button = element.shadowRoot?.querySelector('button');
    button?.click();
    expect(service.placeOrder).toHaveBeenCalled();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
