import { fixture } from '@open-wc/testing-helpers';
import {
  Carrier,
  CheckoutService,
  CheckoutShipmentService,
  CheckoutState,
  CheckoutStepCallback,
  ShipmentMethod,
} from '@spryker-oryx/checkout';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { html } from 'lit';
import { Observable, of, take } from 'rxjs';

import { CheckoutShipmentComponent } from './shipment.component';
import { checkoutShipmentComponent } from './shipment.def';

class MockCheckoutShipmentService implements Partial<CheckoutShipmentService> {
  getCarriers = vi.fn().mockReturnValue(of([]));
  selected = vi.fn().mockReturnValue(of(null));
  select = vi.fn();
}

export class MockCheckoutService implements Partial<CheckoutService> {
  register = vi.fn();
  getState = vi.fn().mockReturnValue(of(CheckoutState.Initializing));
}

describe('CheckoutShipmentComponent', () => {
  let element: CheckoutShipmentComponent;
  let checkoutService: MockCheckoutService;
  let shipmentService: MockCheckoutShipmentService;
  let callback: () => Observable<unknown>;

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
          provide: CheckoutShipmentService,
          useClass: MockCheckoutShipmentService,
        },
      ],
    });

    shipmentService = injector.inject<MockCheckoutShipmentService>(
      CheckoutShipmentService
    );
    checkoutService = injector.inject<MockCheckoutService>(CheckoutService);
    checkoutService.register.mockImplementation(
      (param: CheckoutStepCallback<unknown>) =>
        (callback = param.collectDataCallback)
    );
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

    it('should register the step at the checkout service', () => {
      expect(checkoutService.register).toHaveBeenCalledWith({
        id: 'shipment',
        collectDataCallback: expect.anything(),
      } as CheckoutStepCallback<unknown>);
    });
  });

  describe('when there are no carriers available', () => {
    beforeEach(async () => {
      shipmentService.getCarriers.mockReturnValue(of(null));
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
      shipmentService.getCarriers.mockReturnValue(
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
      shipmentService.getCarriers.mockReturnValue(
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
        shipmentService.selected.mockReturnValue(of(null));
        element = await fixture(
          html`<oryx-checkout-shipment></oryx-checkout-shipment>`
        );
      });

      it('should auto select the first', () => {
        expect(shipmentService.select).toHaveBeenCalledWith('foo');
      });
    });

    describe('and there is a selected method', () => {
      beforeEach(async () => {
        shipmentService.selected.mockReturnValue(of({ id: 'foo' }));
        element = await fixture(
          html`<oryx-checkout-shipment></oryx-checkout-shipment>`
        );
      });

      it('should select the input', () => {
        expect(element).toContainElement(`input[value='foo']:checked`);
      });
    });

    describe('and when a method is selected', () => {
      beforeEach(async () => {
        const radio =
          element.renderRoot.querySelector<HTMLInputElement>(
            `input[value='bar']`
          );
        radio?.dispatchEvent(new Event('change'));
      });

      it('should set the associated shipping method', () => {
        expect(shipmentService.select).toHaveBeenCalledWith('bar');
      });
    });
  });

  describe('when the collect callback is called', () => {
    let result: unknown | null;
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-checkout-shipment></oryx-checkout-shipment>`
      );
      callback()
        .pipe(take(1))
        .subscribe((r) => (result = r));
    });
    it('should collect the method', () => {
      expect(result).toBe(null);
    });
  });

  describe('when the shipment service exposes a selected method', () => {
    beforeEach(async () => {
      shipmentService.selected.mockReturnValue(
        of({ id: 'foo' } as ShipmentMethod)
      );

      element = await fixture(
        html`<oryx-checkout-shipment></oryx-checkout-shipment>`
      );
    });

    describe('and the data is collected', () => {
      let result: { idShipmentMethod: string } | null;
      beforeEach(async () => {
        callback()
          .pipe(take(1))
          .subscribe((r: any) => (result = r));
      });

      it('should collect the method', () => {
        expect(result?.idShipmentMethod).toBe('foo');
      });
    });
  });
});
