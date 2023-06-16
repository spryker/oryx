import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import {
  Address,
  AddressEventDetail,
  AddressService,
  AddressStateService,
  CrudState,
} from '@spryker-oryx/user';
import { html } from 'lit';
import { BehaviorSubject, of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { UserAddressEditComponentOptions } from '../address-edit';
import { EditTarget } from '../address-list-item';
import { UserAddressListComponent } from './address-list.component';
import { userAddressListComponent } from './address-list.def';

const mockBillingAddress: Address = { id: 'billing' };
const mockShippingAddress: Address = {
  id: 'shipping',
};
const mockAddresses = [mockBillingAddress, mockShippingAddress];

class MockAddressService implements Partial<AddressService> {
  get = vi.fn();
  getList = vi.fn();
  delete = vi.fn().mockReturnValue(of({}));
}
class MockRouterService implements Partial<RouterService> {
  currentParams = vi.fn().mockReturnValue(of());
}

const mockState = new BehaviorSubject<{
  action: CrudState;
  selected?: Address | null;
}>({
  action: CrudState.Read,
  selected: null,
});
class MockAddressStateService implements Partial<AddressStateService> {
  set = vi.fn();
  get = vi.fn().mockReturnValue(mockState);
  clear = vi.fn();
}

describe('UserAddressListComponent', () => {
  let element: UserAddressListComponent;
  let service: MockAddressService;
  let addressStateService: MockAddressStateService;

  beforeAll(async () => {
    await useComponent(userAddressListComponent);
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

    it('should clear the state', () => {
      expect(addressStateService.clear).toHaveBeenCalled();
    });
  });

  describe('when there are no addresses provided', () => {
    beforeEach(async () => {
      service.getList.mockReturnValue(of(null));
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
      service.getList.mockReturnValue(of(mockAddresses));
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

      it('should render 2 address items', () => {
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

      describe('and an address is selected', () => {
        beforeEach(async () => {
          addressStateService.get.mockReturnValue(of({ selected: 'shipping' }));
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

      describe('and an address is selected', () => {
        let spy: SpyInstance<Event[]>;
        beforeEach(() => {
          spy = vi.spyOn(element, 'dispatchEvent');
          element.renderRoot
            .querySelector<HTMLInputElement>(`input[value='shipping']`)
            ?.click();
        });

        it('should set the selected item in the address state service', () => {
          expect(addressStateService.set).toHaveBeenCalled();
        });

        it('should dispatch a custom change event', () => {
          expect(spy).toHaveBeenCalledWith(
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
        addressStateService.get.mockReturnValue(
          of({ action: CrudState.Update })
        );
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
          const spy = vi.spyOn(event, 'stopPropagation');

          beforeEach(() => {
            element.renderRoot
              .querySelector('oryx-modal')
              ?.dispatchEvent(event);
          });

          it('should stop propagating the event', () => {
            expect(spy).toHaveBeenCalled();
          });

          it('should clear the state', () => {
            expect(addressStateService.clear).toHaveBeenCalled();
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
