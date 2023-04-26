import { fixture } from '@open-wc/testing-helpers';
import {
  CheckoutOrchestrationService,
  CheckoutShipmentService,
  CheckoutStepType,
  CheckoutTrigger,
} from '@spryker-oryx/checkout';
import {
  MockCheckoutOrchestrationService,
  mockCheckoutProviders,
  mockDeliveryTimeShipmentMethod,
  mockFilteredShipmentMethods,
} from '@spryker-oryx/checkout/mocks';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { radioComponent } from '@spryker-oryx/ui';
import { html } from 'lit';
import { of } from 'rxjs';
import { CheckoutShipmentComponent } from './shipment.component';
import { checkoutShipmentComponent } from './shipment.def';

class MockShipmentService implements Partial<CheckoutShipmentService> {
  getCarriers = vi.fn().mockReturnValue(of(null));
  getSelectedShipmentMethod = vi.fn().mockReturnValue(of(0));
  setShipmentMethod = vi.fn().mockReturnValue(of());
}

class MockLocaleService implements Partial<LocaleService> {
  formatDate = vi.fn().mockReturnValue(of('mockdate'));
}

describe('Checkout Shipment Selector component', () => {
  let element: CheckoutShipmentComponent;
  let shipmentService: MockShipmentService;
  let orchestrationService: MockCheckoutOrchestrationService;
  let localeService: MockLocaleService;

  beforeAll(async () => {
    await useComponent([checkoutShipmentComponent, radioComponent]);
  });

  beforeEach(() => {
    const injector = createInjector({
      providers: [
        ...mockCheckoutProviders,
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

    shipmentService = injector.inject<MockShipmentService>(
      CheckoutShipmentService
    );
    localeService = injector.inject<MockLocaleService>(LocaleService);
    orchestrationService = injector.inject<MockCheckoutOrchestrationService>(
      CheckoutOrchestrationService
    );
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when the component is added', () => {
    beforeEach(async () => {
      shipmentService.getCarriers.mockReturnValue(
        of(mockFilteredShipmentMethods)
      );
      element = await fixture(
        html`<oryx-checkout-shipment></oryx-checkout-shipment>`
      );
    });

    it('is defined', async () => {
      expect(element).toBeInstanceOf(CheckoutShipmentComponent);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe('when there are no shipment methods available', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-checkout-shipment></oryx-checkout-shipment>`
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
        html`<oryx-checkout-shipment></oryx-checkout-shipment>`
      );
    });

    it('should render a tile for each method', () => {
      const tiles = element.renderRoot.querySelectorAll('oryx-tile');
      expect(tiles?.length).toBe(4);
    });

    describe('and there is no method selected', () => {
      it('should auto select the first method', () => {
        expect(shipmentService.setShipmentMethod).toHaveBeenCalledWith(1);
      });

      describe('and when the 2nd method is selected', () => {
        beforeEach(async () => {
          const radio =
            element.renderRoot.querySelector<HTMLInputElement>(
              `input[value='3']`
            );
          radio?.click();
        });

        it('should set the associated shipping method', () => {
          expect(shipmentService.setShipmentMethod).toHaveBeenCalledWith(3);
        });
      });
    });

    describe('and a shipping method is selected', () => {
      beforeEach(async () => {
        shipmentService.getCarriers.mockReturnValue(
          of(mockFilteredShipmentMethods)
        );
        shipmentService.getSelectedShipmentMethod.mockReturnValue(of(3));
        element = await fixture(
          html`<oryx-checkout-shipment></oryx-checkout-shipment>`
        );
      });

      it('should select the last radio input', () => {
        expect(element).toContainElement(`input[value='3']:checked`);
      });
    });

    describe('when a shipment method has a delivery time', () => {
      beforeEach(async () => {
        shipmentService.getCarriers.mockReturnValue(
          of(mockDeliveryTimeShipmentMethod)
        );
        element = await fixture(
          html`<oryx-checkout-shipment></oryx-checkout-shipment>`
        );
      });

      it('should format the delivery time', () => {
        expect(localeService.formatDate).toHaveBeenLastCalledWith(
          mockDeliveryTimeShipmentMethod[0].shipmentMethods[0].deliveryTime
        );
      });
    });

    describe('and the orchestrator triggers CheckoutTrigger.Check', () => {
      beforeEach(async () => {
        orchestrationService.getTrigger.mockReturnValue(
          of(CheckoutTrigger.Check)
        );
        shipmentService.getSelectedShipmentMethod.mockReturnValue(of(3));
        element = await fixture(
          html`<oryx-checkout-shipment></oryx-checkout-shipment>`
        );
      });

      it('should report the selected method', () => {
        expect(orchestrationService.report).toHaveBeenCalledWith(
          CheckoutStepType.Shipping,
          true
        );
      });
    });
  });
});
