import { fixture } from '@open-wc/testing-helpers';
import {
  CheckoutDataService,
  CheckoutService,
  CheckoutStateService,
} from '@spryker-oryx/checkout';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  Address,
  AddressEventDetail,
  AddressService,
} from '@spryker-oryx/user';
import { useComponent } from '@spryker-oryx/utilities';
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BehaviorSubject, of } from 'rxjs';
import { CheckoutBillingAddressComponent } from './billing-address.component';
import { checkoutBillingAddressComponent } from './billing-address.def';

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

describe('CheckoutBillingAddressComponent', () => {
  let element: CheckoutBillingAddressComponent;
  let checkoutStateService: MockCheckoutStateService;
  let addressService: MockAddressService;

  beforeAll(async () => {
    await useComponent(checkoutBillingAddressComponent);
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
        html`<oryx-checkout-billing-address></oryx-checkout-billing-address>`
      );
    });

    it('should be an instance of ', () => {
      expect(element).toBeInstanceOf(CheckoutBillingAddressComponent);
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe('when there are no addresses', () => {
    const mockAddressSubject = new BehaviorSubject<Address | null>(null);
    beforeEach(async () => {
      checkoutStateService.get.mockReturnValue(mockAddressSubject);
      element = await fixture(
        html`<oryx-checkout-billing-address></oryx-checkout-billing-address>`
      );
    });

    it('should not render oryx-checkout-address', () => {
      expect(element).not.toContainElement('oryx-checkout-address');
    });

    it('should render the "shipping address by default" text', () => {
      expect(element.renderRoot.textContent).contain(
        'Same as shipping address'
      );
    });

    it('should have a change button by default', () => {
      const button = element.renderRoot.querySelector('button');
      expect(button?.textContent).contain('Change');
    });

    describe('and the shipping address is reused', () => {
      describe('and the shipping address is changed', () => {
        beforeEach(() => {
          mockAddressSubject.next(mockAddress);
        });

        it('should set the shipping address on the billing address', () => {
          expect(checkoutStateService.set).toHaveBeenCalledWith(
            'billingAddress',
            { valid: true, value: mockAddress }
          );
        });
      });

      describe('and the change button is clicked', () => {
        beforeEach(() => {
          element.renderRoot.querySelector('button')?.click();
        });

        it('should render the "same as shipping address" button', () => {
          const button = element.renderRoot.querySelector('button');
          expect(button?.textContent).contain('Same as shipping address');
        });

        describe('and the shipping address is changed', () => {
          beforeEach(() => {
            mockAddressSubject.next(mockAddress);
          });

          it('should not set the shipping address on the billing address', () => {
            expect(checkoutStateService.set).not.toHaveBeenCalledWith(
              'billingAddress',
              expect.any
            );
          });
        });
      });
    });
  });

  describe('when there are addresses', () => {
    beforeEach(async () => {
      addressService.getList.mockReturnValue([1, 2, 3]);
      element = await fixture(
        html`<oryx-checkout-billing-address></oryx-checkout-billing-address>`
      );
    });

    it('should render oryx-checkout-manage-address', () => {
      expect(element).toContainElement('oryx-checkout-manage-address');
    });

    it('should render the oryx-checkout-address', () => {
      expect(element).toContainElement('oryx-checkout-address');
    });

    describe('and there is no pre-selected address', () => {
      describe('and there is a default billing address', () => {
        beforeEach(async () => {
          addressService.getList.mockReturnValue([
            mockAddress,
            { id: 'bar', isDefaultBilling: true } as Address,
            3,
          ]);
          checkoutStateService.get.mockReturnValue(of(null));
          element = await fixture(
            html`<oryx-checkout-billing-address></oryx-checkout-billing-address>`
          );
        });

        it('should auto-select the default billing address', () => {
          expect(checkoutStateService.set).toHaveBeenCalledWith(
            'billingAddress',
            { valid: true, value: { id: 'bar', isDefaultBilling: true } }
          );
        });
      });

      describe('and there is no default billing address', () => {
        beforeEach(async () => {
          addressService.getList.mockReturnValue([mockAddress, 2, 3]);
          checkoutStateService.get.mockReturnValue(of(null));
          element = await fixture(
            html`<oryx-checkout-billing-address></oryx-checkout-billing-address>`
          );
        });

        it('should auto-select the first address', () => {
          expect(checkoutStateService.set).toHaveBeenCalledWith(
            'billingAddress',
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

      it('should set the billing address on the checkoutStateService', () => {
        expect(checkoutStateService.set).toHaveBeenCalledWith(
          'billingAddress',
          { valid: mockValid, value: mockAddress }
        );
      });
    });
  });
});
