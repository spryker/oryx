import { fixture } from '@open-wc/testing-helpers';
import {
  CheckoutDataService,
  CheckoutService,
  CheckoutStateService,
} from '@spryker-oryx/checkout';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  Address,
  AddressEventDetail,
  AddressService,
} from '@spryker-oryx/user';
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { of } from 'rxjs';
import { CheckoutAddressComponent } from '../address';
import { CheckoutShippingAddressComponent } from './shipping-address.component';
import { checkoutShippingAddressComponent } from './shipping-address.def';

export class MockCheckoutService implements Partial<CheckoutService> {
  getStatus = vi.fn().mockReturnValue(of());
}

export class MockCheckoutDataService implements Partial<CheckoutDataService> {
  get = vi.fn();
}

export class MockCheckoutStateService implements Partial<CheckoutStateService> {
  get = vi.fn();
  set = vi.fn();
  isInvalid = vi.fn().mockReturnValue(of(false));
}

class MockAddressService implements Partial<AddressService> {
  getList = vi.fn().mockReturnValue(of([]));
}

const mockAddress = { id: 'foo' };
const mockValid = false;

@customElement('oryx-checkout-address')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MockComponent extends LitElement {
  isValid = vi.fn();
}

describe('CheckoutShippingAddressComponent', () => {
  let element: CheckoutShippingAddressComponent;
  let checkoutStateService: MockCheckoutStateService;
  let addressService: MockAddressService;

  beforeAll(async () => {
    await useComponent(checkoutShippingAddressComponent);
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
        html`<oryx-checkout-shipping-address></oryx-checkout-shipping-address>`
      );
    });

    it('should be an instance of ', () => {
      expect(element).toBeInstanceOf(CheckoutShippingAddressComponent);
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe('when there is a list of addresses', () => {
    beforeEach(async () => {
      addressService.getList.mockReturnValue([1, 2, 3]);
      element = await fixture(
        html`<oryx-checkout-shipping-address></oryx-checkout-shipping-address>`
      );
    });

    it('should render oryx-checkout-manage-address', () => {
      expect(element).toContainElement('oryx-checkout-manage-address');
    });

    it('should render the oryx-checkout-address', () => {
      expect(element).toContainElement('oryx-checkout-address');
    });

    describe('and there is no pre-selected address', () => {
      describe('and there is a default shipping address', () => {
        beforeEach(async () => {
          addressService.getList.mockReturnValue([
            mockAddress,
            { id: 'bar', isDefaultShipping: true } as Address,
            3,
          ]);
          checkoutStateService.get.mockReturnValue(of(null));
          element = await fixture(
            html`<oryx-checkout-shipping-address></oryx-checkout-shipping-address>`
          );
        });

        it('should auto-select the default shipping address', () => {
          expect(checkoutStateService.set).toHaveBeenCalledWith(
            'shippingAddress',
            { valid: true, value: { id: 'bar', isDefaultShipping: true } }
          );
        });
      });

      describe('and there is no default shipping address', () => {
        beforeEach(async () => {
          addressService.getList.mockReturnValue([mockAddress, 2, 3]);
          checkoutStateService.get.mockReturnValue(of(null));
          element = await fixture(
            html`<oryx-checkout-shipping-address></oryx-checkout-shipping-address>`
          );
        });

        it('should auto-select the first address', () => {
          expect(checkoutStateService.set).toHaveBeenCalledWith(
            'shippingAddress',
            { valid: true, value: mockAddress }
          );
        });
      });
    });

    describe('and the change event is dispatched on the list', () => {
      beforeEach(() => {
        element.renderRoot
          .querySelector('oryx-checkout-manage-address')
          ?.dispatchEvent(
            new CustomEvent<AddressEventDetail>('change', {
              detail: { address: mockAddress, valid: mockValid },
            })
          );
      });

      it('should set the shipping address on the checkoutStateService', () => {
        expect(checkoutStateService.set).toHaveBeenCalledWith(
          'shippingAddress',
          { valid: mockValid, value: mockAddress }
        );
      });
    });
  });

  describe('when there is no list of addresses', () => {
    beforeEach(async () => {
      addressService.getList.mockReturnValue([]);
      element = await fixture(
        html`<oryx-checkout-shipping-address></oryx-checkout-shipping-address>`
      );
    });

    it('should not render oryx-checkout-manage-address', () => {
      expect(element).not.toContainElement('oryx-checkout-manage-address');
    });

    it('should render oryx-checkout-address', () => {
      expect(element).toContainElement('oryx-checkout-address');
    });

    describe('and the change event is dispatched on the checkout address', () => {
      beforeEach(() => {
        element.renderRoot
          .querySelector('oryx-checkout-address')
          ?.dispatchEvent(
            new CustomEvent<AddressEventDetail>('change', {
              detail: { address: mockAddress, valid: mockValid },
            })
          );
      });

      it('should set the shipping address on the checkoutStateService', () => {
        expect(checkoutStateService.set).toHaveBeenCalledWith(
          'shippingAddress',
          { valid: mockValid, value: mockAddress }
        );
      });
    });
  });

  describe('when the isValid method is called', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-checkout-shipping-address></oryx-checkout-shipping-address>`
      );
      element.isValid(true);
    });

    it('should call the isValid method on the address component', () => {
      expect(
        element.renderRoot.querySelector<CheckoutAddressComponent>(
          'oryx-checkout-address'
        )?.isValid
      ).toHaveBeenCalled();
    });
  });
});
