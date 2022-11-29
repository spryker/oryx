import { fixture } from '@open-wc/testing-helpers';
import { CheckoutPaymentService } from '@spryker-oryx/checkout';
import { mockPaymentMethods } from '@spryker-oryx/checkout/mocks';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { radioComponent } from '@spryker-oryx/ui';
import { html } from 'lit';
import { of } from 'rxjs';
import { CheckoutPaymentSelectorComponent } from './payment-selector.component';
import { checkoutPaymentSelectorComponent } from './payment-selector.def';

class MockPaymentService implements Partial<CheckoutPaymentService> {
  getMethods = vi.fn().mockReturnValue(of(mockPaymentMethods));
}

describe('Checkout Payment Selector component', () => {
  let element: CheckoutPaymentSelectorComponent;
  let paymentService: MockPaymentService;

  const getElement = async () => {
    element = await fixture(
      html`<oryx-checkout-payment-selector></oryx-checkout-payment-selector>`
    );
  };

  beforeAll(async () => {
    await useComponent([checkoutPaymentSelectorComponent, radioComponent]);
  });

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: CheckoutPaymentService,
          useClass: MockPaymentService,
        },
      ],
    });

    paymentService = testInjector.inject(
      CheckoutPaymentService
    ) as MockPaymentService;
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('is defined', async () => {
    await getElement();
    expect(element).toBeInstanceOf(CheckoutPaymentSelectorComponent);
  });

  it('passes the a11y audit', async () => {
    await getElement();
    await expect(element).shadowDom.to.be.accessible();
  });

  describe('when there are no payment methods available', () => {
    beforeEach(async () => {
      paymentService.getMethods.mockReturnValue(of(null));

      await getElement();
    });

    it('should not render any tiles', () => {
      const tiles = element.renderRoot.querySelectorAll('oryx-tile');

      expect(tiles?.length).toBe(0);
    });
  });

  describe('when there is at least one payment method available', () => {
    beforeEach(async () => {
      await getElement();
    });

    it('should render oryx-tile', () => {
      const tiles = element.renderRoot.querySelectorAll('oryx-tile');
      expect(tiles?.length).toBe(4);
    });

    it('should select the first radio button', () => {
      const radio = element.renderRoot.querySelector(
        'oryx-radio input'
      ) as HTMLInputElement;

      expect(radio.checked).toBeTruthy();
    });
  });
});
