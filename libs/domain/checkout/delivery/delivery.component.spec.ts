import { fixture } from '@open-wc/testing-helpers';
import {
  CheckoutDataService,
  CheckoutService,
  CheckoutStateService,
  isValid,
} from '@spryker-oryx/checkout';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { AddressService } from '@spryker-oryx/user';
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { of } from 'rxjs';
import { CheckoutDeliveryComponent } from './delivery.component';
import { checkoutDeliveryComponent } from './delivery.def';

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

class MockAddressService implements Partial<AddressService> {
  getAddresses = vi.fn().mockReturnValue(of([]));
}

const mockReport = vi.fn();

@customElement('oryx-checkout-address')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MockComponent extends LitElement implements isValid {
  isValid = mockReport;
}

describe('CheckoutDeliveryComponent', () => {
  let element: CheckoutDeliveryComponent;
  let checkoutStateService: MockCheckoutStateService;
  let addressService: MockAddressService;

  beforeAll(async () => {
    await useComponent(checkoutDeliveryComponent);
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
        {
          provide: AddressService,
          useClass: MockAddressService,
        },
      ],
    });

    checkoutStateService =
      injector.inject<MockCheckoutStateService>(CheckoutStateService);
    addressService = injector.inject<MockAddressService>(AddressService);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when the component is created', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-checkout-delivery></oryx-checkout-delivery>`
      );
    });

    it('should be an instance of ', () => {
      expect(element).toBeInstanceOf(CheckoutDeliveryComponent);
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe('if there is a list of addresses', () => {
    beforeEach(async () => {
      addressService.getAddresses.mockReturnValue([1, 2, 3]);
      element = await fixture(
        html`<oryx-checkout-delivery></oryx-checkout-delivery>`
      );
    });

    it('should render oryx-checkout-manage-address', () => {
      expect(element).toContainElement('oryx-checkout-manage-address');
    });

    it('should render the oryx-checkout-address', () => {
      expect(element).toContainElement('oryx-checkout-address');
    });
  });

  describe('if there is no list of addresses', () => {
    beforeEach(async () => {
      addressService.getAddresses.mockReturnValue([]);
      element = await fixture(
        html`<oryx-checkout-delivery></oryx-checkout-delivery>`
      );
    });

    it('should not render oryx-checkout-manage-address', () => {
      expect(element).not.toContainElement('oryx-checkout-manage-address');
    });

    it('should render oryx-checkout-address', () => {
      expect(element).toContainElement('oryx-checkout-address');
    });

    describe('and the selectedAddress event is dispatched', () => {
      beforeEach(() => {
        const addressElement = element.renderRoot.querySelector(
          'oryx-checkout-address'
        );
        addressElement?.dispatchEvent(
          new CustomEvent('selectedAddress', {
            detail: { valid: true, value: { foo: 'bar' } },
          })
        );
      });

      it('should dispatch an onchange event', () => {
        expect(checkoutStateService.set).toHaveBeenCalled();
      });
    });
  });

  describe('when the isValid method is called', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-checkout-delivery></oryx-checkout-delivery>`
      );
      element.isValid(true);
    });

    it('should call the isValid method on the address component', () => {
      expect(mockReport).toHaveBeenCalled();
    });
  });
});
