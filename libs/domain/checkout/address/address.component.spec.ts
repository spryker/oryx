import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import {
  AddressService,
  AddressStateService,
  CrudState,
} from '@spryker-oryx/user';
import { useComponent } from '@spryker-oryx/utilities';
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BehaviorSubject, of } from 'rxjs';
import { CheckoutStatus } from '../src/models';
import {
  CheckoutDataService,
  CheckoutService,
  CheckoutStateService,
} from '../src/services';
import { CheckoutAddressComponent } from './address.component';
import { checkoutAddressComponent } from './address.def';
import { CheckoutAddressOptions } from './address.model';

class MockAddressService implements Partial<AddressService> {
  getList = vi.fn();
}
class MockCheckoutStateService implements Partial<CheckoutStateService> {
  get = vi.fn();
}
class MockCheckoutService implements Partial<CheckoutService> {
  getStatus = vi.fn().mockReturnValue(of(CheckoutStatus.Ready));
}
class MockCheckoutDataService implements Partial<CheckoutDataService> {}
const mockState = new BehaviorSubject({
  action: CrudState.Read,
  selected: null,
});
class MockAddressStateService implements Partial<AddressStateService> {
  set = vi.fn();
  get = vi.fn().mockReturnValue(mockState);
}
class MockRouterService implements Partial<RouterService> {
  currentParams = vi.fn().mockReturnValue(of());
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
  let addressStateService: MockAddressStateService;

  beforeAll(async () => {
    await useComponent(checkoutAddressComponent);
  });

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: CheckoutService,
          useClass: MockCheckoutService,
        },
        {
          provide: CheckoutStateService,
          useClass: MockCheckoutStateService,
        },
        {
          provide: CheckoutDataService,
          useClass: MockCheckoutDataService,
        },
        {
          provide: AddressService,
          useClass: MockAddressService,
        },
        {
          provide: AddressStateService,
          useClass: MockAddressStateService,
        },
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
      ],
    });

    addressService = testInjector.inject<MockAddressService>(AddressService);
    addressStateService =
      testInjector.inject<MockAddressStateService>(AddressStateService);
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
      addressService.getList.mockReturnValue(of([]));
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

    describe('and the isValid method is called', () => {
      describe('and the report = true', () => {
        beforeEach(async () => {
          element.isValid(true);
        });

        it('should check the form validity', () => {
          expect(form.checkValidity).toHaveBeenCalled();
        });

        it('should report the form validity', () => {
          expect(form?.reportValidity).toHaveBeenCalled();
        });
      });
    });

    describe('when there is an address list', () => {
      beforeEach(async () => {
        addressService.getList.mockReturnValue(of([{}]));
      });

      describe('and the enableList option is false', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-checkout-address
              .options=${{ enableList: false } as CheckoutAddressOptions}
            ></oryx-checkout-address>`
          );
        });

        it('should not render the oryx-user-address-form', () => {
          expect(element).not.toContainElement('oryx-user-address-form');
        });

        it('should not render the oryx-user-address-list', () => {
          expect(element).not.toContainElement('oryx-user-address-list');
        });

        it('should render the oryx-user-address', () => {
          expect(element).toContainElement('oryx-user-address');
        });
      });

      describe('and the enableList option is true', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-checkout-address
              .options=${{ enableList: true } as CheckoutAddressOptions}
            ></oryx-checkout-address>`
          );
        });

        it('should not render the oryx-user-address-form', () => {
          expect(element).not.toContainElement('oryx-user-address-form');
        });

        it('should render the oryx-user-address-list', () => {
          expect(element).toContainElement('oryx-user-address-list');
        });

        it('should not render the oryx-user-address', () => {
          expect(element).not.toContainElement('oryx-user-address');
        });

        describe('and an change event is dispatched on the list', () => {
          beforeEach(() => {
            const list = element.renderRoot.querySelector(
              'oryx-user-address-list'
            ) as HTMLElement;
            list.dispatchEvent(
              new CustomEvent('change', {
                detail: { address: { foo: 'bar' } },
              })
            );
          });

          it('should set the address to the state service', () => {
            expect(addressStateService.set).toHaveBeenCalled();
          });
        });
      });
    });
  });
});
