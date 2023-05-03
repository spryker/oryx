import { fixture } from '@open-wc/testing-helpers';
import { CheckoutService } from '@spryker-oryx/checkout';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { AddressService } from '@spryker-oryx/user';
import { html } from 'lit';
import { Observable, of, take } from 'rxjs';
import { CheckoutAddressComponent } from '../address/address.component';
import { mockCheckoutProviders, MockCheckoutService } from '../src/mocks/src';
import { CheckoutDeliveryComponent } from './delivery.component';
import { checkoutDeliveryComponent } from './delivery.def';

class MockAddressService implements Partial<AddressService> {
  getAddresses = vi.fn().mockReturnValue(of([]));
}

describe('CheckoutDeliveryComponent', () => {
  let element: CheckoutDeliveryComponent;
  let checkoutService: MockCheckoutService;
  let addressService: MockAddressService;
  let callback: () => Observable<unknown>;

  beforeAll(async () => {
    await useComponent(checkoutDeliveryComponent);
  });

  beforeEach(async () => {
    const injector = createInjector({
      providers: [
        ...mockCheckoutProviders,
        {
          provide: AddressService,
          useClass: MockAddressService,
        },
      ],
    });

    addressService = injector.inject<MockAddressService>(AddressService);
    checkoutService = injector.inject<MockCheckoutService>(CheckoutService);
    checkoutService.register.mockImplementation((param, fn) => (callback = fn));
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

    it('should register the step at the checkout service', () => {
      expect(checkoutService.register).toHaveBeenCalledWith(
        'shippingAddress',
        expect.anything(),
        2
      );
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

  describe('when the collect callback is called', () => {
    let address: CheckoutAddressComponent;
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-checkout-delivery></oryx-checkout-delivery>`
      );
      address = element.shadowRoot?.querySelector(
        'oryx-checkout-address'
      ) as CheckoutAddressComponent;
      address.collectData = vi.fn();
      callback().pipe(take(1)).subscribe();
    });
    it('should collect the address', () => {
      expect(address.collectData).toHaveBeenCalled();
    });
  });
});
