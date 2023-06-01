import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { Address, AddressService } from '@spryker-oryx/user';
import { mockCurrentAddress } from '@spryker-oryx/user/mocks';
import { html } from 'lit';
import { of } from 'rxjs';
import { UserAddressListItemComponent } from './address-list-item.component';
import { addressListItemComponent } from './address-list-item.def';
import { AddressDefaults } from './address-list-item.model';

class MockAddressService implements Partial<AddressService> {
  getAddress = vi.fn().mockReturnValue(of(mockCurrentAddress));
  getAddresses = vi.fn();
}

describe('UserAddressListItemComponent', () => {
  let element: UserAddressListItemComponent;
  let service: MockAddressService;

  const addressWithDefaults = (
    isDefaultShipping = false,
    isDefaultBilling = false
  ): Address => ({
    ...mockCurrentAddress,
    isDefaultShipping,
    isDefaultBilling,
  });

  beforeAll(async () => {
    await useComponent(addressListItemComponent);
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

    service = testInjector.inject(
      AddressService
    ) as unknown as MockAddressService;

    element = await fixture(html`<oryx-user-address-list-item
      addressId="currentaddressid"
    ></oryx-user-address-list-item>`);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe('when address id is not provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-address-list-item></oryx-user-address-list-item>`
      );
    });

    it('should not render inner content', () => {
      expect(element).not.toContainElement('[slot="subtext"]');
    });
  });

  describe('when no address', () => {
    beforeEach(async () => {
      service.getAddress.mockReturnValue(of(null));

      element = await fixture(
        html`<oryx-user-address-list-item
          addressId="currentaddressid"
        ></oryx-user-address-list-item>`
      );
    });

    it('should not render inner content', () => {
      expect(element).not.toContainElement('[slot="subtext"]');
    });
  });

  describe('when item is selectable', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-address-list-item
          addressId="currentaddressid"
          .options=${{ selectable: true }}
        ></oryx-user-address-list-item>`
      );
    });

    it('should render slot for input', () => {
      expect(element).toContainElement('slot');
    });
  });

  describe('when item has no controls', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-address-list-item
          addressId="currentaddressid"
        ></oryx-user-address-list-item>`
      );
    });

    it('should not render control section', () => {
      expect(element).not.toContainElement('.controls');
    });
  });

  describe('when item has controls', () => {
    const editCallback = vi.fn();
    const removeCallback = vi.fn();

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-address-list-item
          addressId="currentaddressid"
          .options=${{ editable: true, removable: true }}
          @oryx.edit=${editCallback}
          @oryx.remove=${removeCallback}
        ></oryx-user-address-list-item>`
      );
    });

    it('should render controls', () => {
      expect(
        element.renderRoot.querySelectorAll('oryx-icon-button').length
      ).toBe(2);
    });

    describe('and edit button is clicked', () => {
      beforeEach(() => {
        (
          element.renderRoot.querySelector(
            'oryx-icon-button:nth-child(1) > button'
          ) as HTMLButtonElement
        )?.click();
      });

      it('should emit the event with address', () => {
        expect(editCallback).toHaveBeenCalledWith(
          expect.objectContaining({ detail: { address: expect.any(Object) } })
        );
      });
    });

    describe('and remove button is clicked', () => {
      beforeEach(() => {
        (
          element.renderRoot.querySelector(
            'oryx-icon-button:nth-child(2) > button'
          ) as HTMLButtonElement
        )?.click();
      });

      it('should emit the event with address', () => {
        expect(removeCallback).toHaveBeenCalledWith(
          expect.objectContaining({ detail: { address: expect.any(Object) } })
        );
      });
    });

    describe('and item is editable only', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-user-address-list-item
            addressId="currentaddressid"
            .options=${{ editable: true }}
          ></oryx-user-address-list-item>`
        );
      });

      it('should render only one button', () => {
        expect(
          element.renderRoot.querySelectorAll('oryx-icon-button').length
        ).toBe(1);
      });
    });

    describe('and item is removable only', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-user-address-list-item
            addressId="currentaddressid"
            .options=${{ removable: true }}
          ></oryx-user-address-list-item>`
        );
      });

      it('should render only one button', () => {
        expect(
          element.renderRoot.querySelectorAll('oryx-icon-button').length
        ).toBe(1);
      });
    });
  });

  describe('when showing of default is not configured', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-address-list-item
          addressId="currentaddressid"
        ></oryx-user-address-list-item>`
      );
    });

    it('should not render defaults', () => {
      expect(element).not.toContainElement('oryx-chip');
    });
  });

  describe('when configured showing of all defaults', () => {
    beforeEach(async () => {
      service.getAddress.mockReturnValue(of(addressWithDefaults(true, true)));

      element = await fixture(
        html`<oryx-user-address-list-item
          addressId="currentaddressid"
          .options=${{ addressDefaults: AddressDefaults.All }}
        ></oryx-user-address-list-item>`
      );
    });

    it('should not render the defaults', () => {
      expect(element.renderRoot.querySelectorAll('oryx-chip').length).toBe(2);
    });

    describe('and address is not isDefaultShipping', () => {
      beforeEach(async () => {
        service.getAddress.mockReturnValue(
          of(addressWithDefaults(false, true))
        );

        element = await fixture(
          html`<oryx-user-address-list-item
            addressId="currentaddressid"
            .options=${{ addressDefaults: AddressDefaults.All }}
          ></oryx-user-address-list-item>`
        );
      });

      it('should render single default', () => {
        expect(element.renderRoot.querySelectorAll('oryx-chip').length).toBe(1);
      });
    });

    describe('and address is not isDefaultBilling', () => {
      beforeEach(async () => {
        service.getAddress.mockReturnValue(of(addressWithDefaults(true)));

        element = await fixture(
          html`<oryx-user-address-list-item
            addressId="currentaddressid"
            .options=${{ addressDefaults: AddressDefaults.All }}
          ></oryx-user-address-list-item>`
        );
      });

      it('should render single default', () => {
        expect(element.renderRoot.querySelectorAll('oryx-chip').length).toBe(1);
      });
    });
  });
});
