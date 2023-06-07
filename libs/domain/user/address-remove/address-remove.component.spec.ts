import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import {
  Address,
  AddressService,
  AddressStateService,
  CrudState,
} from '@spryker-oryx/user';
import { html } from 'lit';
import { BehaviorSubject, of } from 'rxjs';
import { UserAddressRemoveComponent } from './address-remove.component';
import { addressRemoveComponent } from './address-remove.def';

const mockAddress: Address = { id: 'foo' };
class MockAddressService implements Partial<AddressService> {
  getAddress = vi.fn().mockReturnValue(of(mockAddress));
  getAddresses = vi.fn().mockReturnValue(of([mockAddress]));
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

describe('UserAddressRemoveComponent', () => {
  let element: UserAddressRemoveComponent;
  let addressService: MockAddressService;

  beforeAll(async () => {
    await useComponent(addressRemoveComponent);
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

    addressService = testInjector.inject<MockAddressService>(AddressService);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when the component is instantiated', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-user-address-remove
        .addressId=${mockAddress.id}
      ></oryx-user-address-remove>`);
    });

    it('should be an instance of UserAddressRemoveComponent', () => {
      expect(element).toBeInstanceOf(UserAddressRemoveComponent);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should not open the confirmation modal', () => {
      expect(element).not.toContainElement('oryx-modal');
    });

    it('should not get the address', () => {
      expect(addressService.getAddress).not.toHaveBeenCalled();
    });
  });

  describe('when the user clicks the button', () => {
    beforeEach(() => {
      element.renderRoot.querySelector('button')?.click();
    });

    it('should open the confirmation modal', () => {
      expect(element).toContainElement('oryx-modal');
    });

    it('should render the user address', () => {
      expect(element).toContainElement('oryx-user-address');
    });

    describe('and when the confirm remove button is clicked', () => {
      beforeEach(async () => {
        console.log('before click');
        element.renderRoot
          .querySelector<HTMLButtonElement>(
            `oryx-button[slot='footer-more'] button`
          )
          ?.click();
      });

      it('should load the address by id', () => {
        expect(addressService.getAddress).toHaveBeenCalledWith(mockAddress.id);
      });

      it('should remove the address from the service', () => {
        expect(addressService.deleteAddress).toHaveBeenCalled();
      });
    });

    describe('when the oryx.close event is dispatched', () => {
      beforeEach(() => {
        const modal = element.renderRoot.querySelector('oryx-modal');
        modal?.dispatchEvent(new CustomEvent('oryx.close', {}));
      });

      it('should close the modal', () => {
        expect(element).not.toContainElement('oryx-modal');
      });
    });
  });

  // describe('when address id is not provided', () => {
  //   beforeEach(async () => {
  //     element = await fixture(
  //       html`<oryx-user-address-remove></oryx-user-address-remove>`
  //     );
  //   });

  //   it('should not render inner content', () => {
  //     expect(element).not.toContainElement('oryx-user-address');
  //   });
  // });

  // describe('when no address', () => {
  //   beforeEach(async () => {
  //     service.getAddress.mockReturnValue(of(null));

  //     element = await fixture(
  //       html`<oryx-user-address-remove
  //         addressId="currentaddressid"
  //       ></oryx-user-address-remove>`
  //     );
  //   });

  //   it('should not render inner content', () => {
  //     expect(element).not.toContainElement('oryx-user-address');
  //   });
  // });

  // describe('when address is rendered', () => {
  //   beforeEach(async () => {
  //     element = await fixture(
  //       html`<oryx-user-address-remove
  //         addressId="currentaddressid"
  //       ></oryx-user-address-remove>`
  //     );
  //   });

  //   it('should render content', () => {
  //     expect(element).toContainElement('oryx-user-address');
  //   });
  // });

  // describe('when cancel button is clicked', () => {
  //   const callback = vi.fn();

  //   beforeEach(async () => {
  //     element = await fixture(
  //       html`<oryx-user-address-remove
  //         addressId="currentaddressid"
  //         @oryx.cancel=${callback}
  //       ></oryx-user-address-remove>`
  //     );

  //     (
  //       element.renderRoot.querySelector('button') as HTMLButtonElement
  //     )?.click();
  //   });

  //   it('should emit the event without address', () => {
  //     expect(callback).toHaveBeenCalledWith(
  //       expect.not.objectContaining({ detail: { address: mockCurrentAddress } })
  //     );
  //   });
  // });

  // describe('when confirm button is clicked', () => {
  //   const callback = vi.fn();

  //   beforeEach(async () => {
  //     element = await fixture(
  //       html`<oryx-user-address-remove
  //         addressId="currentaddressid"
  //         @oryx.confirm=${callback}
  //       ></oryx-user-address-remove>`
  //     );

  //     (
  //       element.renderRoot.querySelector(
  //         'oryx-button:nth-child(2) > button'
  //       ) as HTMLButtonElement
  //     )?.click();
  //   });

  //   it('should emit the event with address', () => {
  //     expect(callback).toHaveBeenCalledWith(
  //       expect.objectContaining({ detail: { address: mockCurrentAddress } })
  //     );
  //   });
  // });
});
