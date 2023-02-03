import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { ModalComponent } from '@spryker-oryx/ui/modal';
import { AddressService } from '@spryker-oryx/user';
import {
  AddressBookComponent,
  AddressBookState,
  CHANGE_STATE_EVENT,
} from '@spryker-oryx/user/address-book';
import { AddressRemoveComponent } from '@spryker-oryx/user/address-remove';
import { html } from 'lit';
import { of } from 'rxjs';
import { ManageAddressComponent } from './manage-address.component';
import { manageAddressComponent } from './manage-address.def';

class MockAddressService implements Partial<AddressService> {
  deleteAddress = vi.fn().mockReturnValue(of(null));
}

describe('ManageAddressComponent', () => {
  let addressService: MockAddressService;
  let element: ManageAddressComponent;

  const getTrigger = (): HTMLButtonElement =>
    element.renderRoot.querySelector('button') as HTMLButtonElement;

  const getModal = (): ModalComponent =>
    element.renderRoot.querySelector('oryx-modal') as ModalComponent;

  const getConfirmationModal = (): ModalComponent =>
    element.renderRoot.querySelector('oryx-modal oryx-modal') as ModalComponent;

  const getAddressBook = (): AddressBookComponent =>
    element.renderRoot.querySelector(
      'oryx-user-address-book'
    ) as AddressBookComponent;

  const getAddressRemove = (): AddressRemoveComponent =>
    element.renderRoot.querySelector(
      'oryx-user-address-remove'
    ) as AddressRemoveComponent;

  beforeAll(async () => {
    await useComponent(manageAddressComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: AddressService,
          useClass: MockAddressService,
        },
      ],
    });

    addressService = testInjector.inject(
      AddressService
    ) as unknown as MockAddressService;

    element = await fixture(
      html`<oryx-checkout-manage-address></oryx-checkout-manage-address>`
    );
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should pass the header to the modal', async () => {
    expect(getModal().getAttribute('heading')).toEqual('Addresses');
  });

  describe('when trigger is clicked', () => {
    beforeEach(() => {
      getTrigger().click();
    });

    it('should open the modal', () => {
      expect(element).toContainElement('oryx-modal[open]');
    });
  });

  describe('when state is changed', () => {
    beforeEach(() => {
      getAddressBook().dispatchEvent(
        new CustomEvent(CHANGE_STATE_EVENT, {
          detail: { state: AddressBookState.Add },
        })
      );
    });

    it('should change the header', () => {
      expect(getModal().getAttribute('heading')).toBe('Add address');
    });

    it('should change the state', () => {
      expect(getAddressBook().getAttribute('active-state')).toBe(
        AddressBookState.Add
      );
    });

    describe('and modal was closed', () => {
      beforeEach(() => {
        getModal().dispatchEvent(new CustomEvent('oryx.close'));
      });

      it('should close the modal', () => {
        expect(element).not.toContainElement('oryx-modal[open]');
      });

      it('should restore the default state', () => {
        expect(getAddressBook().getAttribute('active-state')).toBe(
          AddressBookState.List
        );
      });
    });
  });

  describe('when the address is deleted', () => {
    const address = { id: 'testId' };
    beforeEach(() => {
      getAddressBook().dispatchEvent(
        new CustomEvent('oryx.remove', {
          detail: { address },
        })
      );
    });

    it('should show the confirmation modal', () => {
      expect(getConfirmationModal().hasAttribute('open')).toBe(true);
    });

    it('should pass address id to the address remove', () => {
      expect(getAddressRemove().addressId).toBe(address.id);
    });

    describe('and deletion is cancelled', () => {
      beforeEach(() => {
        getAddressRemove().dispatchEvent(new CustomEvent('oryx.cancel'));
      });

      it('should close the confirmation modal', () => {
        expect(getConfirmationModal().hasAttribute('open')).toBe(false);
      });
    });

    describe('and deletion is confirmed', () => {
      beforeEach(() => {
        getAddressRemove().dispatchEvent(
          new CustomEvent('oryx.confirm', { detail: { address } })
        );
      });

      it('should call deleteAddress method of the service', () => {
        expect(addressService.deleteAddress).toHaveBeenCalledWith(address);
      });

      it('should close the confirmation modal', () => {
        expect(getConfirmationModal().hasAttribute('open')).toBe(false);
      });
    });
  });
});
