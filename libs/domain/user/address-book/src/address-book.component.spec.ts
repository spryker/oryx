import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { html } from 'lit';
import { AddressEditComponent } from '../../address-edit/src/address-edit.component';
import { AddressBookComponent } from './address-book.component';
import { addressBookComponent } from './address-book.def';
import { AddressBookState } from './address-book.model';

describe('AddressBookComponent', () => {
  let element: AddressBookComponent;

  beforeAll(async () => {
    await useComponent(addressBookComponent);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when activeState is "list"', () => {
    const callback = vi.fn();
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-user-address-book
          @oryx.change-state=${callback}
        ></oryx-user-address-book>
      `);
    });

    it('should render the address list', () => {
      expect(element).toContainElement('oryx-address-list');
    });

    describe('and add new address button is clicked', () => {
      beforeEach(() => {
        element.renderRoot
          .querySelector('oryx-button button')
          ?.dispatchEvent(new Event('click'));
      });

      it('should dispatch the event with active state', () => {
        expect(callback).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: expect.objectContaining({
              state: AddressBookState.Add,
            }),
          })
        );
      });

      it('should not render the address list', () => {
        expect(element).not.toContainElement('oryx-address-list');
      });

      it('should render address edit component', () => {
        expect(element).toContainElement('oryx-user-address-edit');
      });
    });

    describe('and address list dispatches "oryx.edit" event', () => {
      const addressId = 'testId';
      beforeEach(() => {
        element.renderRoot.querySelector('oryx-address-list')?.dispatchEvent(
          new CustomEvent('oryx.edit', {
            detail: { address: { id: addressId } },
          })
        );
      });

      it('should not render the list', () => {
        expect(element).not.toContainElement('oryx-address-list');
      });

      it('should render address edit component', () => {
        expect(element).toContainElement('oryx-user-address-edit');
      });

      it('should set selected address id', () => {
        const editComponent = element.renderRoot.querySelector(
          'oryx-user-address-edit'
        ) as AddressEditComponent;
        expect(editComponent.addressId).toBe(addressId);
      });

      describe('and edit is cancelled', () => {
        beforeEach(async () => {
          element.renderRoot
            .querySelector('oryx-user-address-edit')
            ?.dispatchEvent(new CustomEvent('oryx.back'));
        });

        it('should render the list', () => {
          expect(element).toContainElement('oryx-address-list');
        });

        it('should not render the address edit component', () => {
          expect(element).not.toContainElement('oryx-user-address-edit');
        });
      });

      describe('and edit is successful', () => {
        beforeEach(async () => {
          element.renderRoot
            .querySelector('oryx-user-address-edit')
            ?.dispatchEvent(new CustomEvent('oryx.success'));
        });

        it('should render the list', () => {
          expect(element).toContainElement('oryx-address-list');
        });

        it('should not render the address edit component', () => {
          expect(element).not.toContainElement('oryx-user-address-edit');
        });
      });
    });
  });
});
