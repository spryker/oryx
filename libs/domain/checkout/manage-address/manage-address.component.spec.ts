import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { ModalComponent } from '@spryker-oryx/ui/modal';
import {
  Address,
  AddressService,
  AddressStateService,
  CrudState,
} from '@spryker-oryx/user';
import { UserAddressEditComponent } from '@spryker-oryx/user/address-edit';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { BehaviorSubject, of } from 'rxjs';
import { CheckoutStatus } from '../src/models';
import {
  CheckoutDataService,
  CheckoutService,
  CheckoutStateService,
} from '../src/services';
import { CheckoutManageAddressComponent } from './manage-address.component';
import { checkoutManageAddressComponent } from './manage-address.def';

class MockAddressService implements Partial<AddressService> {
  getList = vi.fn();
}
class MockCheckoutStateService implements Partial<CheckoutStateService> {
  get = vi.fn();
  isInvalid = vi.fn().mockReturnValue(of(false));
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
  clear = vi.fn();
}

class MockRouterService implements Partial<RouterService> {
  currentParams = vi.fn().mockReturnValue(of());
}

describe('CheckoutManageAddressComponent', () => {
  let element: CheckoutManageAddressComponent;
  let addressStateService: MockAddressStateService;

  beforeAll(async () => {
    await useComponent(checkoutManageAddressComponent);
  });

  beforeEach(async () => {
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

    addressStateService =
      testInjector.inject<MockAddressStateService>(AddressStateService);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when the element is created', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-checkout-manage-address></oryx-checkout-manage-address>`
      );
    });

    it('should be a class of ManageAddressComponent', async () => {
      expect(element).toBeInstanceOf(CheckoutManageAddressComponent);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should render a button', () => {
      expect(element).toContainElement('oryx-button');
    });

    it('should not render the modal by default ', () => {
      expect(element).not.toContainElement('oryx-modal');
    });
  });

  describe('when the user clicks on the "change" button', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-checkout-manage-address></oryx-checkout-manage-address>`
      );
      element.shadowRoot?.querySelector<HTMLElement>('oryx-button')?.click();
    });

    it('should open the modal', () => {
      expect(element).toContainElement('oryx-modal');
    });

    it('should clear the selected item state', () => {
      expect(addressStateService.clear).toHaveBeenCalled();
    });

    it('should render a specific modal heading', () => {
      const modal =
        element.renderRoot.querySelector<ModalComponent>('oryx-modal');
      expect(modal?.heading).toBe('Addresses');
    });

    it('should render the address-add-button', () => {
      expect(element).toContainElement('oryx-user-address-add-button');
    });

    it('should render the address list', () => {
      expect(element).toContainElement('oryx-user-address-list');
    });

    it('should not render the editor', () => {
      expect(element).not.toContainElement('oryx-user-address-edit');
    });

    it('should render the save button in the footer', () => {
      const saveButton = element.renderRoot.querySelector(
        `oryx-button[slot='footer-more'`
      );
      expect(saveButton?.textContent?.trim()).toBe('Select');
    });

    describe('when the change event is dispatched', () => {
      const mockAddress: Address = { id: '123' };
      const event = new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { address: mockAddress },
      });
      event.stopPropagation = vi.fn();

      beforeEach(() => {
        const list = element.renderRoot.querySelector('oryx-user-address-list');
        list?.dispatchEvent(event);
      });

      it('should prevent the event from bubbling up', () => {
        expect(event.stopPropagation).toHaveBeenCalled();
      });

      describe('and the select button is clicked', () => {
        beforeEach(async () => {
          const button = element.renderRoot.querySelector<HTMLButtonElement>(
            `oryx-button[slot='footer-more'] button`
          );
          element.dispatchEvent = vi.fn();
          button?.click();
        });

        it('should dispatch a change event with the selected address', () => {
          expect(element.dispatchEvent).toHaveBeenCalledWith(
            new CustomEvent('change', {
              detail: { address: mockAddress },
              bubbles: true,
              composed: true,
            })
          );
        });

        it('should close the modal', () => {
          expect(element).not.toContainElement('oryx-modal');
        });
      });
    });

    describe('when the oryx.close event is dispatched', () => {
      beforeEach(() => {
        const modal = element.renderRoot.querySelector('oryx-modal');
        modal?.dispatchEvent(new CustomEvent('oryx.close', {}));
      });

      it('should change the action state to Read', () => {
        expect(addressStateService.clear).toHaveBeenCalled();
      });

      it('should close the modal open', () => {
        expect(element).not.toContainElement('oryx-modal');
      });

      it('should set the address crud state to Read', () => {
        expect(addressStateService.clear).toHaveBeenCalled();
      });
    });

    [CrudState.Create, CrudState.Update].forEach((action) => {
      describe(`when the action state = ${action}`, () => {
        beforeEach(() => {
          mockState.next({ action, selected: null });
        });

        it('should render a specific modal heading', () => {
          const modal =
            element.renderRoot.querySelector<ModalComponent>('oryx-modal');
          expect(modal?.heading).toBe(
            action === CrudState.Create ? 'Add address' : 'Edit address'
          );
        });

        it('should not render the address list', () => {
          expect(element).not.toContainElement('oryx-user-address-list');
        });

        it('should render the address-add-button', () => {
          expect(element).not.toContainElement('oryx-user-address-add-button');
        });

        it('should render the editor', () => {
          expect(element).toContainElement('oryx-user-address-edit');
        });

        it('should render the save button in the footer', () => {
          const saveButton = element.renderRoot.querySelector(
            `oryx-button[slot='footer-more'`
          );
          expect(saveButton?.textContent?.trim()).toBe('Save');
        });

        describe('when the change event is dispatched', () => {
          const mockAddress: Address = { id: '123' };
          const event = new CustomEvent('change', {
            bubbles: true,
            composed: true,
            detail: { address: mockAddress },
          });
          event.stopPropagation = vi.fn();

          beforeEach(() => {
            const editor = element.renderRoot.querySelector(
              'oryx-user-address-edit'
            );
            editor?.dispatchEvent(event);
          });

          it('should prevent the event from bubbling up', () => {
            expect(event.stopPropagation).toHaveBeenCalled();
          });
        });

        describe('when the oryx.back event is dispatched', () => {
          beforeEach(() => {
            const modal = element.renderRoot.querySelector('oryx-modal');
            modal?.dispatchEvent(new CustomEvent('oryx.back', {}));
          });

          it('should change the action state to Read', () => {
            expect(addressStateService.clear).toHaveBeenCalledWith();
          });

          it('should keep the modal open', () => {
            expect(element).toContainElement('oryx-modal[open]');
          });
        });

        describe('and the save button is clicked', () => {
          let button: HTMLButtonElement;
          let addressEditComponent: UserAddressEditComponent;

          beforeEach(async () => {
            addressEditComponent = element.renderRoot.querySelector(
              'oryx-user-address-edit'
            ) as UserAddressEditComponent;
            addressEditComponent.submit = vi.fn().mockReturnValue(of({}));
            button = element.renderRoot.querySelector(
              `oryx-button[slot='footer-more'] button`
            ) as HTMLButtonElement;
            button?.click();
          });

          it('should submit the editComponent', () => {
            expect(addressEditComponent.submit).toHaveBeenCalled();
          });
        });
      });
    });
  });
});
