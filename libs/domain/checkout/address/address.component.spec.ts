import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { AddressService } from '@spryker-oryx/user';
import { AddressFormComponent } from '@spryker-oryx/user/address-form';
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

  describe('when there is not address list', () => {
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

    describe('and the data is collected', () => {
      describe('and the form is valid', () => {
        beforeEach(() => {
          const form = document.createElement('form');
          form.innerHTML =
            '<input type="email" name="email" required value="foo@bar.com">';
          const addressForm = element.shadowRoot?.querySelector(
            'oryx-address-form'
          ) as AddressFormComponent;
          addressForm.getForm = () => form;
        });

        it('should return the form data', () => {
          expect(element.collectData()).toEqual({ email: 'foo@bar.com' });
        });
      });

      describe('and the form is invalid', () => {
        beforeEach(() => {
          const form = document.createElement('form');
          form.innerHTML = '<input type="email" name="email" required>';
          const addressForm = element.shadowRoot?.querySelector(
            'oryx-address-form'
          ) as AddressFormComponent;
          addressForm.getForm = () => form;
        });

        it('should not return the form data', () => {
          expect(element.collectData()).toEqual(null);
        });
      });
    });
  });

  describe('when there is an address list', () => {
    beforeEach(async () => {
      addressService.getAddresses.mockReturnValue(of([1, 2, 3]));
      element = await fixture(
        html`<oryx-checkout-address></oryx-checkout-address>`
      );
    });

    it('should render oryx-address-list', () => {
      expect(element).toContainElement('oryx-address-list');
    });

    it('should not render the oryx-address-form', () => {
      expect(element).not.toContainElement('oryx-address-form');
    });

    describe('and an address is selected', () => {
      const address = { foo: 'bar' };
      beforeEach(() => {
        element.renderRoot.querySelector('oryx-address-list')?.dispatchEvent(
          new CustomEvent('oryx.select', {
            detail: { address },
          })
        );
      });

      describe('and the data is collected', () => {
        it('should return the selected address', () => {
          expect(element.collectData()).toEqual(address);
        });
      });
    });

    describe('and an address was not selected', () => {
      describe('and the data is collected', () => {
        it('should not return an address', () => {
          expect(element.collectData()).toEqual(null);
        });
      });
    });
  });
});
