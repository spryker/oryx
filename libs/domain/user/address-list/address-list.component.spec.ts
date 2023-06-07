import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  Address,
  AddressEventDetail,
  AddressService,
  AddressStateService,
  CrudState,
} from '@spryker-oryx/user';

import { RouterService } from '@spryker-oryx/router';
import { html } from 'lit';
import { BehaviorSubject, of } from 'rxjs';
import { UserAddressEditComponentOptions } from '../address-edit';
import { EditTarget } from '../address-list-item';
import { UserAddressListComponent } from './address-list.component';
import { addressListComponent } from './address-list.def';

const mockBillingAddress: Address = { id: 'billing' };
const mockShippingAddress: Address = {
  id: 'shipping',
};
const mockAddresses = [mockBillingAddress, mockShippingAddress];

class MockAddressService implements Partial<AddressService> {
  getAddress = vi.fn();
  getAddresses = vi.fn();
  deleteAddress = vi.fn().mockReturnValue(of({}));
}
class MockRouterService implements Partial<RouterService> {
  currentParams = vi.fn().mockReturnValue(of());
}
const mockAction = new BehaviorSubject<CrudState>(CrudState.Read);
class MockAddressStateService implements Partial<AddressStateService> {
  getAction = vi.fn().mockReturnValue(mockAction);
  setAction = vi.fn();
  select = vi.fn();
  selected = vi.fn();
}

describe('UserAddressListComponent', () => {
  let element: UserAddressListComponent;
  let service: MockAddressService;
  let addressStateService: MockAddressStateService;

  beforeAll(async () => {
    await useComponent(addressListComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
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

    service = testInjector.inject<MockAddressService>(AddressService);
    addressStateService =
      testInjector.inject<MockAddressStateService>(AddressStateService);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when the component is instantiated', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-address-list></oryx-user-address-list>`
      );
    });

    it('should be an instance of UserAddressListComponent', () => {
      expect(element).toBeInstanceOf(UserAddressListComponent);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should set the address crud state to Read', () => {
      expect(addressStateService.setAction).toHaveBeenCalledWith(
        CrudState.Read
      );
    });
  });

  describe('when there are no addresses provided', () => {
    beforeEach(async () => {
      service.getAddresses.mockReturnValue(of(null));
      element = await fixture(
        html`<oryx-user-address-list></oryx-user-address-list>`
      );
    });

    it('should render an empty slot', async () => {
      expect(element).toContainElement('slot[name="empty"]');
    });

    it('should not render address items', () => {
      expect(element).not.toContainElement('oryx-user-address-list-item');
    });
  });

  describe('when there are addresses provided', () => {
    beforeEach(async () => {
      service.getAddresses.mockReturnValue(of(mockAddresses));
    });

    describe('and the selectable option = false', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-user-address-list
            .options=${{ selectable: false }}
          ></oryx-user-address-list>`
        );
      });

      it('should not render an empty slot', async () => {
        expect(element).not.toContainElement('slot[name="empty"]');
      });

      it('should render t4o address items', () => {
        const items = element.renderRoot.querySelectorAll(
          'oryx-tile oryx-user-address-list-item'
        );
        expect(items.length).toBe(2);
      });

      it('should not render an input for the items', () => {
        expect(element).not.toContainElement('input');
      });
    });

    describe('and the selectable option = true', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-user-address-list
            .options=${{ selectable: true }}
          ></oryx-user-address-list>`
        );
      });

      it('should render an input for the items', () => {
        expect(element).toContainElement(`input[value='billing']`);
        expect(element).toContainElement(`input[value='shipping']`);
      });

      it('should not select any inputs', () => {
        expect(element).not.toContainElement('input[checked]');
      });

      describe('and when an address is selected', () => {
        beforeEach(async () => {
          addressStateService.selected.mockReturnValue(of('shipping'));
          element = await fixture(
            html`<oryx-user-address-list
              .options=${{ selectable: true }}
            ></oryx-user-address-list>`
          );
        });

        it('should select the tile', () => {
          expect(element).toContainElement(
            `oryx-tile[selected] input[value='shipping']`
          );
        });
      });

      describe('and when an address is selected', () => {
        beforeEach(() => {
          element.dispatchEvent = vi.fn();
          element.renderRoot
            .querySelector<HTMLInputElement>(`input[value='shipping']`)
            ?.click();
        });

        it('should set the selected item in the address state service', () => {
          expect(addressStateService.select).toHaveBeenCalled();
        });

        it('should dispatch a custom change event', () => {
          expect(element.dispatchEvent).toHaveBeenCalledWith(
            new CustomEvent('change', {
              bubbles: true,
              composed: true,
              detail: { address: mockBillingAddress },
            })
          );
        });
      });
    });

    describe('when the address state = Update', () => {
      beforeEach(async () => {
        addressStateService.getAction.mockReturnValue(of(CrudState.Update));
      });

      describe('and the editTarget is modal', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-user-address-list
              .options=${{
                editTarget: EditTarget.Modal,
              } as UserAddressEditComponentOptions}
            ></oryx-user-address-list>`
          );
        });

        it('should show the modal', () => {
          expect(element).toContainElement('oryx-modal');
        });

        describe('and the close event is dispatched', () => {
          const event = new CustomEvent<AddressEventDetail>('oryx.close');
          event.stopPropagation = vi.fn();

          beforeEach(() => {
            element.renderRoot
              .querySelector('oryx-modal')
              ?.dispatchEvent(event);
          });

          it('should stop propagating the event', () => {
            expect(event.stopPropagation).toHaveBeenCalled();
          });

          it('should change the crud state to readd', () => {
            expect(addressStateService.setAction).toHaveBeenCalledWith(
              CrudState.Read
            );
          });
        });
      });

      describe('and the editTarget is link', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-user-address-list
              .options=${{
                editTarget: EditTarget.Link,
              } as UserAddressEditComponentOptions}
            ></oryx-user-address-list>`
          );
        });

        it('should not show the modal', () => {
          expect(element).not.toContainElement('oryx-modal');
        });
      });

      describe('and the editTarget is inline', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-user-address-list
              .options=${{
                editTarget: EditTarget.Inline,
              } as UserAddressEditComponentOptions}
            ></oryx-user-address-list>`
          );
        });

        it('should not show the modal', () => {
          expect(element).not.toContainElement('oryx-modal');
        });
      });
    });
  });
});
