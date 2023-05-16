import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { AddressService } from '@spryker-oryx/user';
import { html } from 'lit';
import { of } from 'rxjs';
import { CheckoutAddressComponent } from './address.component';
import { checkoutAddressComponent } from './address.def';

class MockAddressService implements Partial<AddressService> {
  getAddresses = vi.fn();
}

describe('CheckoutAddressComponent', () => {
  let element: CheckoutAddressComponent;
  let addressService: MockAddressService;

  beforeAll(async () => {
    await useComponent(checkoutAddressComponent);
  });

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: AddressService,
          useClass: MockAddressService,
        },
      ],
    });

    addressService = testInjector.inject<MockAddressService>(AddressService);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when the component is created', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-checkout-address></oryx-checkout-address>`
      );
    });

    it('should be an instance of ', () => {
      expect(element).toBeInstanceOf(CheckoutAddressComponent);
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe('when there is no address list', () => {
    beforeEach(async () => {
      addressService.getAddresses.mockReturnValue(of([]));
      element = await fixture(
        html`<oryx-checkout-address></oryx-checkout-address>`
      );
    });

    it('should render the oryx-address-form', () => {
      expect(element).toContainElement('oryx-address-form');
    });

    it('should not render oryx-address-list', () => {
      expect(element).not.toContainElement('oryx-address-list');
    });
  });
});
