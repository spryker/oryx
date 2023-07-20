import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { LinkService } from '@spryker-oryx/site';
import {
  Address,
  AddressEventDetail,
  AddressService,
  AddressStateService,
  CrudState,
} from '@spryker-oryx/user';
import { useComponent } from '@spryker-oryx/utilities';
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BehaviorSubject, of } from 'rxjs';
import { UserAddressEditComponent } from './address-edit.component';
import { addressEditComponent } from './address-edit.def';
import {
  SaveOption,
  UserAddressEditComponentOptions,
} from './address-edit.model';

class MockAddressService implements Partial<AddressService> {
  get = vi.fn().mockReturnValue(of({}));
  update = vi.fn().mockReturnValue(of(null));
  add = vi.fn().mockReturnValue(of(null));
  getList = vi.fn();
}
class MockRouterService implements Partial<RouterService> {
  currentParams = vi.fn().mockReturnValue(of());
  navigate = vi.fn();
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
class MockLinkService implements Partial<LinkService> {
  get = vi.fn().mockReturnValue(of('/link'));
}

@customElement('oryx-user-address-form')
class UserAddressForm extends LitElement {
  getForm = vi.fn();
}

describe('UserAddressEditComponent', () => {
  let element: UserAddressEditComponent;
  let addressService: MockAddressService;
  let addressStateService: MockAddressStateService;

  beforeAll(async () => {
    await useComponent(addressEditComponent);
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
        {
          provide: LinkService,
          useClass: MockLinkService,
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

  describe('when the component is instantiated', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-user-address-edit></oryx-user-address-edit>
      `);
    });

    it('should be an instance of UserAddressEditComponent', () => {
      expect(element).toBeInstanceOf(UserAddressEditComponent);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe('when the action state is Read', () => {
    beforeEach(() => {
      mockState.next({ action: CrudState.Read });
    });

    describe('and the inline option = true', () => {
      beforeEach(async () => {
        element = await fixture(html`
          <oryx-user-address-edit
            .options=${{ inline: true } as UserAddressEditComponentOptions}
          ></oryx-user-address-edit>
        `);
      });

      it('should not render the edit form', () => {
        expect(element).not.toContainElement('oryx-user-address-form');
      });
    });

    describe('and the inline option = false', () => {
      beforeEach(async () => {
        element = await fixture(html`
          <oryx-user-address-edit
            .options=${{ inline: false } as UserAddressEditComponentOptions}
          ></oryx-user-address-edit>
        `);
      });

      it('should render the edit form', () => {
        expect(element).toContainElement('oryx-user-address-form');
      });
    });
  });

  describe('when the action state is Create', () => {
    beforeEach(() => {
      mockState.next({ action: CrudState.Create });
    });

    describe('and the inline option = true', () => {
      beforeEach(async () => {
        element = await fixture(html`
          <oryx-user-address-edit
            .options=${{ inline: true } as UserAddressEditComponentOptions}
          ></oryx-user-address-edit>
        `);
      });

      it('should render the edit form', () => {
        expect(element).toContainElement('oryx-user-address-form');
      });
    });
  });

  describe('when the save option is set to SaveOption.Save', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-user-address-edit
          .options=${{
            save: SaveOption.Save,
          } as UserAddressEditComponentOptions}
        ></oryx-user-address-edit>
      `);
    });

    // TODO: how to test those?
    // it('should render the cancel button', () => {
    //   const buttons = element.renderRoot.querySelectorAll('oryx-button');
    //   expect(buttons[0]?.textContent?.trim()).toEqual('Cancel');
    // });

    // it('should render the save button', () => {
    //   const buttons = element.renderRoot.querySelectorAll('oryx-button');
    //   expect(buttons[1].textContent?.trim()).toEqual('Save');
    // });

    describe('and the change event is dispatched with a valid address', () => {
      const newAddress: Address = { address1: 'New Street 1' };
      beforeEach(() => {
        element.renderRoot
          .querySelector('oryx-user-address-form')
          ?.dispatchEvent(
            new CustomEvent<AddressEventDetail>('change', {
              detail: { address: newAddress, valid: true },
            })
          );
      });

      it('should not submit the new address right away', () => {
        expect(addressService.add).not.toHaveBeenCalled();
      });

      describe('but when the submit method is called', () => {
        beforeEach(() => {
          element.submit().subscribe();
        });

        it('should submit the changed address', () => {
          expect(addressService.add).toHaveBeenCalledWith({
            ...newAddress,
            isDefaultBilling: false,
            isDefaultShipping: false,
          });
        });

        it('should clear the state', () => {
          expect(addressStateService.clear).toHaveBeenCalled();
        });
      });
    });

    describe('and the change event is dispatched with a valid existing address', () => {
      const updatedAddress: Address = { id: 'foo', address1: 'Old Street 99' };
      beforeEach(() => {
        element.renderRoot
          .querySelector('oryx-user-address-form')
          ?.dispatchEvent(
            new CustomEvent<AddressEventDetail>('change', {
              detail: { address: updatedAddress, valid: true },
            })
          );
      });

      it('should not submit the updated address right away', () => {
        expect(addressService.update).not.toHaveBeenCalled();
      });

      describe('but when the submit method is called', () => {
        beforeEach(() => {
          element.submit().subscribe();
        });

        it('should submit the changed address', () => {
          expect(addressService.update).toHaveBeenCalledWith({
            ...updatedAddress,
            isDefaultBilling: false,
            isDefaultShipping: false,
          });
        });

        it('should clear the state', () => {
          expect(addressStateService.clear).toHaveBeenCalled();
        });
      });
    });
  });

  describe('when the save option is set to SaveOption.None', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-user-address-edit
          .options=${{
            save: SaveOption.None,
          } as UserAddressEditComponentOptions}
        ></oryx-user-address-edit>
      `);
    });

    it('should not render the cancel and save button', () => {
      expect(element).not.toContainElement('button');
    });

    describe('and the change event is dispatched with a valid address', () => {
      const newAddress: Address = { address1: 'New Street 1' };
      beforeEach(() => {
        element.renderRoot
          .querySelector('oryx-user-address-form')
          ?.dispatchEvent(
            new CustomEvent<AddressEventDetail>('change', {
              detail: { address: newAddress, valid: true },
            })
          );
      });

      it('should not submit the new address right away', () => {
        expect(addressService.add).not.toHaveBeenCalled();
      });
    });

    describe('and the change event is dispatched with a valid existing address', () => {
      const updatedAddress: Address = { id: 'foo', address1: 'Old Street 99' };
      beforeEach(() => {
        element.renderRoot
          .querySelector('oryx-user-address-form')
          ?.dispatchEvent(
            new CustomEvent<AddressEventDetail>('change', {
              detail: { address: updatedAddress, valid: true },
            })
          );
      });

      it('should not submit the updated address right away', () => {
        expect(addressService.update).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the save option is set to SaveOption.Instant', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-user-address-edit
          .options=${{
            save: SaveOption.Instant,
          } as UserAddressEditComponentOptions}
        ></oryx-user-address-edit>
      `);
    });

    it('should not render the Cancel and S button', () => {
      expect(element).not.toContainElement('button');
    });

    describe('and the change event is dispatched with a valid new address', () => {
      const newAddress: Address = { address1: 'New Street 1' };
      beforeEach(() => {
        element.renderRoot
          .querySelector('oryx-user-address-form')
          ?.dispatchEvent(
            new CustomEvent<AddressEventDetail>('change', {
              detail: { address: newAddress, valid: true },
            })
          );
      });

      it('should submit the changed address', () => {
        expect(addressService.add).toHaveBeenCalledWith({
          ...newAddress,
          isDefaultBilling: false,
          isDefaultShipping: false,
        });
      });

      it('should clear the state', () => {
        expect(addressStateService.clear).toHaveBeenCalled();
      });
    });

    describe('and the change event is dispatched with a valid existing address', () => {
      const updatedAddress: Address = { id: 'foo', address1: 'Old Street 99' };
      beforeEach(() => {
        element.renderRoot
          .querySelector('oryx-user-address-form')
          ?.dispatchEvent(
            new CustomEvent<AddressEventDetail>('change', {
              detail: { address: updatedAddress, valid: true },
            })
          );
      });

      it('should submit the changed address', () => {
        expect(addressService.update).toHaveBeenCalledWith({
          ...updatedAddress,
          isDefaultBilling: false,
          isDefaultShipping: false,
        });
      });

      it('should clear the state', () => {
        expect(addressStateService.clear).toHaveBeenCalled();
      });
    });
  });
});
