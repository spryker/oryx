import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { LinkService } from '@spryker-oryx/site';
import { ButtonComponent } from '@spryker-oryx/ui/button';
import { IconComponent } from '@spryker-oryx/ui/icon';
import {
  Address,
  AddressService,
  AddressStateService,
  CrudState,
} from '@spryker-oryx/user';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { BehaviorSubject, of } from 'rxjs';
import { UserAddressListItemComponent } from './address-list-item.component';
import { userAddressListItemComponent } from './address-list-item.def';
import {
  AddressDefaults,
  UserAddressListItemOptions,
} from './address-list-item.model';

const mockAddress: Address = {
  id: 'foo',
  isDefaultBilling: true,
  isDefaultShipping: true,
};
class MockAddressService implements Partial<AddressService> {
  get = vi.fn().mockReturnValue(of(mockAddress));
  getList = vi.fn();
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

class MockSemanticLinkService implements Partial<LinkService> {
  get = vi.fn().mockReturnValue(of('/link'));
}

describe('UserAddressListItemComponent', () => {
  let element: UserAddressListItemComponent;
  let addressService: MockAddressService;
  let addressStateService: MockAddressStateService;

  beforeAll(async () => {
    await useComponent(userAddressListItemComponent);
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
          useClass: MockSemanticLinkService,
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

  describe('when the element is instantiated', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-address-list-item></oryx-user-address-list-item>`
      );
    });

    it('should be an instance of UserAddressListItemComponent', () => {
      expect(element).toBeInstanceOf(UserAddressListItemComponent);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe('when there is no address id provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-address-list-item></oryx-user-address-list-item>`
      );
    });

    it('should not render a section', () => {
      expect(element).not.toContainElement('section');
    });
  });

  describe('when the address id does not match an actual address', () => {
    beforeEach(async () => {
      addressService.get.mockReturnValue(of(null));
      element = await fixture(
        html`<oryx-user-address-list-item
          addressId="unknown"
        ></oryx-user-address-list-item>`
      );
    });

    it('should not render a section', () => {
      expect(element).not.toContainElement('section');
    });
  });

  describe('when there is no address id provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-address-list-item
          .addressId=${mockAddress.id}
        ></oryx-user-address-list-item>`
      );
    });

    it('should render a section', () => {
      expect(element).toContainElement('section');
    });
  });

  describe('when the selectable option = true', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-address-list-item
          .addressId=${mockAddress.id}
          .options=${{ selectable: true } as UserAddressListItemOptions}
        ></oryx-user-address-list-item>`
      );
    });

    it('should render an oryx-radio', () => {
      expect(element).toContainElement('oryx-radio');
    });
  });

  describe('when the editable option = true', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-address-list-item
          .addressId=${mockAddress.id}
          .options=${{ editable: true } as UserAddressListItemOptions}
        ></oryx-user-address-list-item>`
      );
    });

    it('should render an edit button inside the control menu', () => {
      const icon = element.renderRoot.querySelector<IconComponent>(
        '.controls oryx-icon-button oryx-icon'
      );
      expect(icon?.type).toBe('edit');
    });

    describe('and the edit button is clicked', () => {
      beforeEach(() => {
        element.renderRoot
          .querySelector<ButtonComponent>('.controls oryx-icon-button button')
          ?.click();
      });

      it('should set the state', () => {
        expect(addressStateService.set).toHaveBeenCalledWith(
          CrudState.Update,
          mockAddress.id
        );
      });
    });
  });

  describe('when the removable option = true', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-address-list-item
          .addressId=${mockAddress.id}
          .options=${{ removable: true } as UserAddressListItemOptions}
        ></oryx-user-address-list-item>`
      );
    });

    it('should render oryx-user-address-remove inside the control menu', () => {
      expect(element).toContainElement('.controls oryx-user-address-remove');
    });
  });

  describe('when editable and removable are both false', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-address-list-item
          .addressId=${mockAddress.id}
          .options=${{
            removable: false,
            editable: false,
          } as UserAddressListItemOptions}
        ></oryx-user-address-list-item>`
      );
    });

    it('should not render the control menu', () => {
      expect(element).not.toContainElement('.controls');
    });
  });

  describe('when the address is marked only for billing', () => {
    beforeEach(() => {
      addressService.get.mockReturnValue(
        of({ id: 'foo', isDefaultBilling: true } as Address)
      );
    });

    describe('and the addressDefaults is All', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-user-address-list-item
            .addressId=${mockAddress.id}
            .options=${{
              addressDefaults: AddressDefaults.All,
            } as UserAddressListItemOptions}
          ></oryx-user-address-list-item>`
        );
      });

      it('should render the default chip', () => {
        const chip = element.renderRoot.querySelector(
          '[slot=subtext] oryx-chip'
        );
        expect(chip?.textContent).toBe('Default billing');
      });
    });

    describe('and the addressDefaults is Billing', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-user-address-list-item
            .addressId=${mockAddress.id}
            .options=${{
              addressDefaults: AddressDefaults.Billing,
            } as UserAddressListItemOptions}
          ></oryx-user-address-list-item>`
        );
      });

      it('should render a single  chip', () => {
        expect(element.renderRoot.querySelectorAll('oryx-chip').length).toBe(1);
      });

      it('should render the default chip', () => {
        const chip = element.renderRoot.querySelector(
          '[slot=subtext] oryx-chip'
        );
        expect(chip?.textContent).toBe('Default');
      });
    });

    describe('and the addressDefaults is Shipping', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-user-address-list-item
            .addressId=${mockAddress.id}
            .options=${{
              addressDefaults: AddressDefaults.Shipping,
            } as UserAddressListItemOptions}
          ></oryx-user-address-list-item>`
        );
      });

      it('should not render any chips', () => {
        expect(element).not.toContainElement('[slot=subchip]');
      });
    });
  });

  describe('when the address is marked only for shipping', () => {
    beforeEach(() => {
      addressService.get.mockReturnValue(
        of({ id: 'foo', isDefaultShipping: true } as Address)
      );
    });

    describe('and the addressDefaults is All', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-user-address-list-item
            .addressId=${mockAddress.id}
            .options=${{
              addressDefaults: AddressDefaults.All,
            } as UserAddressListItemOptions}
          ></oryx-user-address-list-item>`
        );
      });

      it('should render the default chip', () => {
        const chip = element.renderRoot.querySelector(
          '[slot=subtext] oryx-chip'
        );
        expect(chip?.textContent).toBe('Default shipping');
      });
    });

    describe('and the addressDefaults is Shipping', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-user-address-list-item
            .addressId=${mockAddress.id}
            .options=${{
              addressDefaults: AddressDefaults.Shipping,
            } as UserAddressListItemOptions}
          ></oryx-user-address-list-item>`
        );
      });

      it('should render the default chip', () => {
        const chip = element.renderRoot.querySelector(
          '[slot=subtext] oryx-chip'
        );
        expect(chip?.textContent).toBe('Default');
      });
    });

    describe('and the addressDefaults is Billing', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-user-address-list-item
            .addressId=${mockAddress.id}
            .options=${{
              addressDefaults: AddressDefaults.Billing,
            } as UserAddressListItemOptions}
          ></oryx-user-address-list-item>`
        );
      });

      it('should not render any chips', () => {
        expect(element).not.toContainElement('[slot=subchip]');
      });
    });
  });
});
