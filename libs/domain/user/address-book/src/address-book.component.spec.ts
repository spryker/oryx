import { elementUpdated, fixture } from '@open-wc/testing-helpers';
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

  describe('when active-state is not provided', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-user-address-book></oryx-user-address-book>
      `);
    });

    it('should set default list state', () => {
      expect(element.activeState).toBe(AddressBookState.List);
    });
  });

  describe('when active-state is "list"', () => {
    const callback = vi.fn();
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-user-address-book
          .active-state=${AddressBookState.List}
          @oryx.change-state=${callback}
        ></oryx-user-address-book>
      `);
    });

    it('should render address list content', () => {
      expect(element).toContainElement('oryx-button');
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

      it('should change the state to "add"', () => {
        expect(element.activeState).toBe(AddressBookState.Add);
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

      it('should change the state to "edit"', () => {
        expect(element.activeState).toBe(AddressBookState.Edit);
      });

      it('should render address edit content', () => {
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

          element.requestUpdate();
          await elementUpdated(element);
        });

        it('should restore "list" state', () => {
          expect(element.activeState).toBe(AddressBookState.List);
        });

        it('should drop selected address id', async () => {
          element.setAttribute('active-state', AddressBookState.Add);

          element.requestUpdate();
          await elementUpdated(element);

          const editComponent = element.renderRoot.querySelector(
            'oryx-user-address-edit'
          ) as AddressEditComponent;
          expect(editComponent.addressId).toBeNull();
        });
      });

      describe('and edit is successful', () => {
        beforeEach(async () => {
          element.renderRoot
            .querySelector('oryx-user-address-edit')
            ?.dispatchEvent(new CustomEvent('oryx.success'));

          element.requestUpdate();
          await elementUpdated(element);
        });

        it('should restore "list" state', () => {
          expect(element.activeState).toBe(AddressBookState.List);
        });
      });
    });
  });
});
