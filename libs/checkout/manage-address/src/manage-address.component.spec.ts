import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { ModalComponent } from '@spryker-oryx/ui/modal';
import {
  AddressBookComponent,
  AddressBookState,
  CHANGE_STATE_EVENT,
} from '@spryker-oryx/user/address-book';
import { html } from 'lit';
import { ManageAddressComponent } from './manage-address.component';
import { manageAddressComponent } from './manage-address.def';

describe('ManageAddressComponent', () => {
  let element: ManageAddressComponent;

  const getTrigger = (): HTMLButtonElement =>
    element.renderRoot.querySelector('button') as HTMLButtonElement;

  const getModal = (): ModalComponent =>
    element.renderRoot.querySelector('oryx-modal') as ModalComponent;

  const getAddressBook = (): AddressBookComponent =>
    element.renderRoot.querySelector(
      'oryx-user-address-book'
    ) as AddressBookComponent;

  beforeAll(async () => {
    await useComponent(manageAddressComponent);
  });

  beforeEach(async () => {
    element = await fixture(
      html`<oryx-checkout-manage-address></oryx-checkout-manage-address>`
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should pass the header to the modal', async () => {
    expect(getModal().getAttribute('header')).toEqual('Addresses');
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
      expect(getModal().getAttribute('header')).toBe('Add address');
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
});
