import { fixture } from '@open-wc/testing-helpers';
import {
  Carrier,
  CheckoutDataService,
  CheckoutService,
  CheckoutStateService,
  Shipment,
} from '@spryker-oryx/checkout';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';

import { CheckoutShippingMethodComponent } from './shipping-method.component';
import { checkoutShippingMethodComponent } from './shipping-method.def';

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

describe('CheckoutShipmentComponent', () => {
  let element: CheckoutShippingMethodComponent;
  let checkoutDataService: MockCheckoutDataService;
  let checkoutStateService: MockCheckoutStateService;

  beforeAll(async () => {
    await useComponent(checkoutShippingMethodComponent);
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
        html`<oryx-checkout-shipping-method></oryx-checkout-shipping-method>`
      );
    });

    it('should be an instance of ', () => {
      expect(element).toBeInstanceOf(CheckoutShippingMethodComponent);
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe('when there are no carriers available', () => {
    beforeEach(async () => {
      checkoutDataService.get.mockReturnValue(of(null));
      element = await fixture(
        html`<oryx-checkout-shipping-method></oryx-checkout-shipping-method>`
      );
    });

    it('should render an empty message', () => {
      expect(element).toContainElement('.no-methods');
    });

    it('should not render any tiles', () => {
      expect(element).not.toContainElement('oryx-tile');
    });

    it('should render an empty message', () => {
      expect(element).toContainElement('.no-methods');
    });
  });

  describe('when there are carriers available without methods', () => {
    beforeEach(async () => {
      checkoutDataService.get.mockReturnValue(
        of([{ name: 'foo', shipmentMethods: [] }] as Carrier[])
      );
      element = await fixture(
        html`<oryx-checkout-shipping-method></oryx-checkout-shipping-method>`
      );
    });
    it('should not render any tiles', () => {
      expect(element).not.toContainElement('oryx-tile');
    });

    it('should render an empty message', () => {
      expect(element).toContainElement('.no-methods');
    });
  });

  describe('when there is 1 carriers with 1 method available', () => {
    beforeEach(async () => {
      checkoutDataService.get.mockReturnValue(
        of([
          {
            carriers: [
              {
                name: 'foo',
                shipmentMethods: [{ id: 'foo' }, { id: 'bar' }],
              },
            ],
          },
        ] as Shipment[])
      );
      element = await fixture(
        html`<oryx-checkout-shipping-method></oryx-checkout-shipping-method>`
      );
    });

    it('should not render the carrier name', () => {
      expect(element).not.toContainElement('p');
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
          html`<oryx-checkout-shipping-method></oryx-checkout-shipping-method>`
        );
      });

      it('should auto select the first method', () => {
        expect(checkoutStateService.set).toHaveBeenCalledWith('shipment', {
          valid: true,
          value: { idShipmentMethod: 'foo' },
        });
      });
    });

    describe('and there is a selected method', () => {
      beforeEach(async () => {
        checkoutStateService.get.mockReturnValue(
          of({ idShipmentMethod: 'foo' })
        );
        element = await fixture(
          html`<oryx-checkout-shipping-method></oryx-checkout-shipping-method>`
        );
      });

      it('should select the input', () => {
        expect(element).toContainElement(`input[value='foo']:checked`);
      });
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

  describe('when there are multiple carriers available', () => {
    beforeEach(async () => {
      checkoutDataService.get.mockReturnValue(
        of([
          {
            carriers: [
              {
                name: 'foo',
                shipmentMethods: [{ id: 'foo' }, { id: 'bar' }],
              },
              {
                name: 'bar',
                shipmentMethods: [{ id: 'xyz' }],
              },
            ],
          },
        ] as Shipment[])
      );
      element = await fixture(
        html`<oryx-checkout-shipping-method></oryx-checkout-shipping-method>`
      );
    });

    it('should render the carrier names', () => {
      const carrierHeadings = element.renderRoot.querySelectorAll('h3');
      expect(carrierHeadings.length).toBe(2);
      expect(carrierHeadings[0].textContent).toBe('foo');
      expect(carrierHeadings[1].textContent).toBe('bar');
    });

    describe('and when a method is selected', () => {
      beforeEach(async () => {
        const radio =
          element.renderRoot.querySelector<HTMLInputElement>(
            `input[value='xyz']`
          );
        radio?.dispatchEvent(new Event('change'));
      });

      it('should set the associated shipping method', () => {
        expect(checkoutStateService.set).toHaveBeenCalledWith('shipment', {
          valid: true,
          value: { idShipmentMethod: 'xyz' },
        });
      });
    });
  });
});
