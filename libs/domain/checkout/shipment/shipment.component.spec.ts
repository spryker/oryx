import { fixture } from '@open-wc/testing-helpers';
import {
  Carrier,
  CheckoutDataService,
  CheckoutService,
  CheckoutStateService,
  ShipmentMethod,
} from '@spryker-oryx/checkout';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { html } from 'lit';
import { of } from 'rxjs';

import { CheckoutShipmentComponent } from './shipment.component';
import { checkoutShipmentComponent } from './shipment.def';

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

describe('CheckoutShipmentComponent', () => {
  let element: CheckoutShipmentComponent;
  let checkoutDataService: MockCheckoutDataService;
  let checkoutStateService: MockCheckoutStateService;

  beforeAll(async () => {
    await useComponent(checkoutShipmentComponent);
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
        html`<oryx-checkout-shipment></oryx-checkout-shipment>`
      );
    });

    it('should be an instance of ', () => {
      expect(element).toBeInstanceOf(CheckoutShipmentComponent);
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe('when there are no carriers available', () => {
    beforeEach(async () => {
      checkoutDataService.get.mockReturnValue(of(null));
      element = await fixture(
        html`<oryx-checkout-shipment></oryx-checkout-shipment>`
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
        html`<oryx-checkout-shipment></oryx-checkout-shipment>`
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
            name: 'foo',
            shipmentMethods: [{ id: 'foo' }, { id: 'bar' }],
          },
          {
            name: 'bar',
            shipmentMethods: [{ id: 'xyz' }],
          },
        ] as Carrier[])
      );
      element = await fixture(
        html`<oryx-checkout-shipment></oryx-checkout-shipment>`
      );
    });

    it('should render a tile for each method', () => {
      const tiles = element.renderRoot.querySelectorAll('oryx-tile');
      expect(tiles?.length).toBe(3);
    });

    it('should render a radio button for each method', () => {
      const radio = element.renderRoot.querySelectorAll('input');
      expect(radio?.length).toBe(3);
    });

    it('should not render an empty message', () => {
      expect(element).not.toContainElement('.no-methods');
    });

    describe('and there is no selected method', () => {
      beforeEach(async () => {
        checkoutStateService.get.mockReturnValue(of(null));
        element = await fixture(
          html`<oryx-checkout-shipment></oryx-checkout-shipment>`
        );
      });

      it('should auto select the first', () => {
        expect(checkoutStateService.set).toHaveBeenCalledWith('foo');
      });
    });

    describe('and there is a selected method', () => {
      beforeEach(async () => {
        checkoutStateService.get.mockReturnValue(of({ id: 'foo' }));
        element = await fixture(
          html`<oryx-checkout-shipment></oryx-checkout-shipment>`
        );
      });

      it('should select the input', () => {
        expect(element).toContainElement(`input[value='foo']:checked`);
      });

      describe.only('and when a method is selected', () => {
        beforeEach(async () => {
          const radio =
            element.querySelector<HTMLInputElement>(`input[value='foo']`);
          radio?.dispatchEvent(new Event('change'));
          console.log('radio!', radio);
        });

        it('should set the associated shipping method', () => {
          expect(checkoutStateService.set).toHaveBeenCalledWith('shipment', {
            valid: true,
          });
        });
      });
    });
  });

  describe('when the shipment service exposes a selected method', () => {
    beforeEach(async () => {
      checkoutStateService.get.mockReturnValue(
        of({ id: 'foo' } as ShipmentMethod)
      );

      element = await fixture(
        html`<oryx-checkout-shipment></oryx-checkout-shipment>`
      );
    });
  });
});
