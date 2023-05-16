import { fixture } from '@open-wc/testing-helpers';
import {
  CheckoutDataService,
  CheckoutService,
  CheckoutStateService,
} from '@spryker-oryx/checkout';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { AddressService } from '@spryker-oryx/user';
import { html } from 'lit';
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

describe('CheckoutDeliveryComponent', () => {
  let element: CheckoutDeliveryComponent;
  let checkoutService: MockCheckoutService;
  let checkoutDataService: MockCheckoutDataService;
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

    checkoutService = injector.inject<MockCheckoutService>(CheckoutService);
    checkoutDataService =
      injector.inject<MockCheckoutDataService>(CheckoutDataService);
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
  });
});
