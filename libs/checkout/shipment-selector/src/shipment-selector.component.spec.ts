import { fixture } from '@open-wc/testing-helpers';
import { CheckoutShipmentService } from '@spryker-oryx/checkout';
import {
  mockDeliveryTimeShipmentMethod,
  mockFilteredShipmentMethods,
} from '@spryker-oryx/checkout/mocks';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { LocaleService, PricingService } from '@spryker-oryx/site';
import { radioComponent } from '@spryker-oryx/ui';
import { html } from 'lit';
import { of } from 'rxjs';
import { CheckoutShipmentSelectorComponent } from './shipment-selector.component';
import { checkoutShipmentSelectorComponent } from './shipment-selector.def';

class MockShipmentService implements Partial<CheckoutShipmentService> {
  getCarriers = vi.fn().mockReturnValue(of(null));
  getSelectedShipmentMethod = vi.fn().mockReturnValue(of(0));
}

class MockPricingService implements Partial<PricingService> {
  format = vi.fn().mockReturnValue(of('mockprice'));
}

class MockLocaleService implements Partial<LocaleService> {
  formatDate = vi.fn().mockReturnValue(of('mockdate'));
}

describe('Checkout Shipment Selector component', () => {
  let element: CheckoutShipmentSelectorComponent;
  let shipmentService: MockShipmentService;
  let localeService: MockLocaleService;

  beforeAll(async () => {
    await useComponent([checkoutShipmentSelectorComponent, radioComponent]);
  });

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: PricingService,
          useClass: MockPricingService,
        },
        {
          provide: CheckoutShipmentService,
          useClass: MockShipmentService,
        },
        {
          provide: LocaleService,
          useClass: MockLocaleService,
        },
      ],
    });

    shipmentService = testInjector.inject(
      CheckoutShipmentService
    ) as unknown as MockShipmentService;
    localeService = testInjector.inject(
      LocaleService
    ) as unknown as MockLocaleService;
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('is defined', async () => {
    element = await fixture(
      html`<checkout-shipment-selector></checkout-shipment-selector>`
    );
    expect(element).toBeInstanceOf(CheckoutShipmentSelectorComponent);
  });

  it('passes the a11y audit', async () => {
    shipmentService.getCarriers.mockReturnValue(
      of(mockFilteredShipmentMethods)
    );
    element = await fixture(
      html`<checkout-shipment-selector></checkout-shipment-selector>`
    );

    await expect(element).shadowDom.to.be.accessible();
  });

  describe('when there are no shipment methods available', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<checkout-shipment-selector></checkout-shipment-selector>`
      );
    });

    it('should not render any tiles', () => {
      const tiles = element.renderRoot.querySelectorAll('oryx-tile');
      expect(tiles?.length).toBe(0);
    });
  });

  describe('when there is at least one shipment method available', () => {
    beforeEach(async () => {
      shipmentService.getCarriers.mockReturnValue(
        of(mockFilteredShipmentMethods)
      );
      element = await fixture(
        html`<checkout-shipment-selector></checkout-shipment-selector>`
      );
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

    describe('when a shipment method has a delivery time', () => {
      beforeEach(async () => {
        shipmentService.getCarriers.mockReturnValue(
          of(mockDeliveryTimeShipmentMethod)
        );
        element = await fixture(
          html`<checkout-shipment-selector></checkout-shipment-selector>`
        );
      });

      it('should format the delivery time', () => {
        expect(localeService.formatDate).toHaveBeenLastCalledWith(
          mockDeliveryTimeShipmentMethod[0].shipmentMethods[0].deliveryTime
        );
      });
    });

    describe('when a shipment method is already selected', () => {
      beforeEach(async () => {
        shipmentService.getSelectedShipmentMethod.mockReturnValue(of(2));
        element = await fixture(
          html`<checkout-shipment-selector></checkout-shipment-selector`
        );
      });

      it('should select the corresponding radio button', () => {
        const buttons = element.renderRoot.querySelectorAll(
          'oryx-radio input'
        ) as NodeListOf<HTMLInputElement>;
        expect(buttons.length).toBe(4);
        expect(buttons[1].checked).toBeTruthy();
      });
    });
  });
});
