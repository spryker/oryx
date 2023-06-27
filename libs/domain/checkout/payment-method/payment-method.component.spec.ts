import { fixture } from '@open-wc/testing-helpers';
import {
  CheckoutDataService,
  CheckoutService,
  CheckoutStateService,
} from '@spryker-oryx/checkout';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { html } from 'lit';
import { of } from 'rxjs';

import { CheckoutPaymentMethodComponent } from './payment-method.component';
import { checkoutPaymentComponent } from './payment-method.def';

export class MockCheckoutService implements Partial<CheckoutService> {
  getStatus = vi.fn().mockReturnValue(of());
}

export class MockCheckoutDataService implements Partial<CheckoutDataService> {
  get = vi.fn();
}

export class MockCheckoutStateService implements Partial<CheckoutStateService> {
  get = vi.fn();
  set = vi.fn();
  isInvalid = vi.fn().mockReturnValue(of(false));
}

describe('CheckoutPaymentComponent', () => {
  let element: CheckoutPaymentMethodComponent;
  let checkoutDataService: MockCheckoutDataService;
  let checkoutStateService: MockCheckoutStateService;

  beforeAll(async () => {
    await useComponent(checkoutPaymentComponent);
  });

  beforeEach(async () => {
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
      ],
    });

    checkoutDataService =
      injector.inject<MockCheckoutDataService>(CheckoutDataService);
    checkoutStateService =
      injector.inject<MockCheckoutStateService>(CheckoutStateService);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when the component is created', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-checkout-payment-method></oryx-checkout-payment-method>`
      );
    });

    it('should be an instance of CheckoutPaymentComponent', () => {
      expect(element).toBeInstanceOf(CheckoutPaymentMethodComponent);
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe('when there are no payment methods available', () => {
    beforeEach(async () => {
      checkoutDataService.get.mockReturnValue(of([]));
      element = await fixture(
        html`<oryx-checkout-payment-method></oryx-checkout-payment-method>`
      );
    });

    it('should render an empty message', () => {
      expect(element).toContainElement('.no-methods');
    });

    it('should not render any tiles', () => {
      expect(element).not.toContainElement('oryx-tile');
    });
  });

  describe('when there are payment methods available', () => {
    beforeEach(async () => {
      checkoutDataService.get.mockReturnValue(
        of([{ id: 'foo' }, { id: 'bar' }])
      );
      element = await fixture(
        html`<oryx-checkout-payment-method></oryx-checkout-payment-method>`
      );
    });

    it('should render a tile for each method', () => {
      const tiles = element.renderRoot.querySelectorAll('oryx-tile');
      expect(tiles?.length).toBe(2);
    });

    it('should render a radio button for each method', () => {
      const radio = element.renderRoot.querySelectorAll('input');
      expect(radio?.length).toBe(2);
    });

    it('should not render an empty message', () => {
      expect(element).not.toContainElement('.no-methods');
    });

    describe('and there is no selected method', () => {
      beforeEach(async () => {
        checkoutStateService.get.mockReturnValue(of(null));
        element = await fixture(
          html`<oryx-checkout-payment-method></oryx-checkout-payment-method>`
        );
      });

      it('should auto select the first method', () => {
        expect(checkoutStateService.set).toHaveBeenCalledWith('payments', {
          valid: true,
          value: [{ id: 'foo' }],
        });
      });
    });

    describe('and there is a selected method', () => {
      beforeEach(async () => {
        checkoutStateService.get.mockReturnValue(of([{ id: 'foo' }]));
        element = await fixture(
          html`<oryx-checkout-payment-method></oryx-checkout-payment-method>`
        );
      });

      it('should select the input', () => {
        expect(element).toContainElement(`input[value='foo']:checked`);
      });

      describe('and when a method is selected', () => {
        beforeEach(async () => {
          const radio =
            element.renderRoot.querySelector<HTMLInputElement>(
              `input[value='bar']`
            );
          radio?.dispatchEvent(new Event('change'));
        });

        it('should set the associated payment method', () => {
          expect(checkoutStateService.set).toHaveBeenCalledWith('payments', {
            valid: true,
            value: [{ id: 'bar' }],
          });
        });
      });
    });
  });

  describe('when there are payment methods available', () => {
    beforeEach(async () => {
      checkoutDataService.get.mockReturnValue(
        of([{ id: 'foo' }, { id: 'bar' }])
      );
      element = await fixture(
        html`<oryx-checkout-payment-method></oryx-checkout-payment-method>`
      );
    });

    describe('and isValid() is called', () => {
      let form: HTMLFormElement;

      beforeEach(() => {
        form = element.renderRoot.querySelector('form') as HTMLFormElement;
        form.reportValidity = vi.fn();
        form.checkValidity = vi.fn();
      });

      describe('and the report argument is true', () => {
        beforeEach(async () => {
          element.isValid(true);
        });

        it('should call checkValidity', () => {
          expect(form.checkValidity).toHaveBeenCalled();
        });

        it('should report form validation', () => {
          expect(form.reportValidity).toHaveBeenCalled();
        });
      });

      describe('and the report argument is false', () => {
        beforeEach(async () => {
          element.isValid(false);
        });

        it('should call checkValidity', () => {
          expect(form.checkValidity).toHaveBeenCalled();
        });

        it('should not report form validation', () => {
          expect(form.reportValidity).not.toHaveBeenCalled();
        });
      });
    });
  });
});
