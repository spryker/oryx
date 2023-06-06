import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { AddressService } from '@spryker-oryx/user';
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { of } from 'rxjs';
import { CheckoutAddressComponent } from './address.component';
import { checkoutAddressComponent } from './address.def';

class MockAddressService implements Partial<AddressService> {
  getAddresses = vi.fn();
}

const form = {
  checkValidity: vi.fn(),
  reportValidity: vi.fn(),
};

@customElement('oryx-user-address-form')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MockComponent extends LitElement {
  getForm() {
    return form;
  }
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

    it('should be an instance of CheckoutAddressComponent', () => {
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

    it('should render the oryx-user-address-form', () => {
      expect(element).toContainElement('oryx-user-address-form');
    });

    it('should not render oryx-user-address-list', () => {
      expect(element).not.toContainElement('oryx-user-address-list');
    });

    describe('and when the isValid method is called', () => {
      describe('and the report = true', () => {
        beforeEach(async () => {
          element.isValid(true);
        });

        it('should check the form validity', () => {
          expect(form.checkValidity).toHaveBeenCalled();
        });

        it('should report the form validity', () => {
          expect(form.reportValidity).toHaveBeenCalled();
        });
      });
    });

    describe('and the report = false', () => {
      beforeEach(async () => {
        element.isValid(false);
      });

      it('should check the form validity', () => {
        expect(form.checkValidity).toHaveBeenCalled();
      });

      it('should report the form validity', () => {
        expect(form.reportValidity).not.toHaveBeenCalled();
      });
    });
  });

  describe('when there is an address list', () => {
    beforeEach(async () => {
      addressService.getAddresses.mockReturnValue(of([{}]));
      element = await fixture(
        html`<oryx-checkout-address></oryx-checkout-address>`
      );
    });

    it('should not render the oryx-user-address-form', () => {
      expect(element).not.toContainElement('oryx-user-address-form');
    });

    it('should render the oryx-user-address-list', () => {
      expect(element).toContainElement('oryx-user-address-list');
    });

    describe('and when an oryx.select event is dispatched on the list', () => {
      beforeEach(() => {
        element.dispatchEvent = vi.fn();
        const list = element.renderRoot.querySelector(
          'oryx-user-address-list'
        ) as HTMLElement;
        list.dispatchEvent(
          new CustomEvent('oryx.select', {
            detail: { address: { foo: 'bar' } },
          })
        );
      });

      it('should dispatch a selectedAddress event', () => {
        expect(element.dispatchEvent).toHaveBeenCalled();
      });

      describe('and when the isValid method is called', () => {
        beforeEach(async () => {
          element.isValid(true);
        });

        it('should not check validity on the address form', () => {
          expect(form.checkValidity).not.toHaveBeenCalled();
        });
      });
    });
  });
});
