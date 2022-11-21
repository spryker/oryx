import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { AddressService } from '@spryker-oryx/user';
import {
  mockAddressBase,
  mockCurrentAddressBase,
} from '@spryker-oryx/user/mocks';
import { html } from 'lit';
import { of } from 'rxjs';
import { AddressListComponent } from './address-list.component';
import { addressListComponent } from './address-list.def';

class MockAddressService implements Partial<AddressService> {
  getAddresses = vi
    .fn()
    .mockReturnValue(of([mockCurrentAddressBase, mockAddressBase]));
}

describe('AddressFormComponent', () => {
  let element: AddressListComponent;
  let service: MockAddressService;

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
      ],
    });

    service = testInjector.inject(
      AddressService
    ) as unknown as MockAddressService;
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('passes the a11y audit', async () => {
    element = await fixture(html`<oryx-address-list></oryx-address-list>`);

    await expect(element).shadowDom.to.be.accessible();
  });

  it('should render empty slot if no addresses', async () => {
    service.getAddresses.mockReturnValue(of(null));
    element = await fixture(html`<oryx-address-list></oryx-address-list>`);
    const emptySlot = element.renderRoot.querySelector('slot[name="empty"]');

    expect(emptySlot).not.toBe(null);
  });

  describe('options', () => {
    it('should be with controls and not selectable by defaults', async () => {
      element = await fixture(html`<oryx-address-list></oryx-address-list>`);
      const radio = element.renderRoot.querySelector('input[type="radio"]');
      const controls = element.renderRoot.querySelector('.controls');

      expect(radio).toBeNull();
      expect(controls).not.toBeNull();
    });

    it('should enable selecting when selectable option is true', async () => {
      element = await fixture(
        html`<oryx-address-list
          .options=${{
            selectable: true,
          }}
        ></oryx-address-list>`
      );
      const radio = element.renderRoot.querySelector('input[type="radio"]');

      expect(radio).not.toBeNull();
    });

    it('should disable controls when editable option is false', async () => {
      element = await fixture(
        html`<oryx-address-list
          .options=${{ editable: false }}
        ></oryx-address-list>`
      );
      const controls = element.renderRoot.querySelector('.controls');

      expect(controls).toBeNull();
    });
  });

  describe('events', () => {
    it('should not emit address change event if no addresses', async () => {
      service.getAddresses.mockReturnValue(of(null));
      const callback = vi.fn();
      element = await fixture(
        html`<oryx-address-list
          @oryx.address-change=${callback}
          .options=${{ selectable: true }}
        ></oryx-address-list>`
      );

      expect(callback).not.toHaveBeenCalled();
    });

    it('should emit address change event for default address', async () => {
      const callback = vi.fn();
      element = await fixture(
        html`<oryx-address-list
          @oryx.address-change=${callback}
          .options=${{ selectable: true }}
        ></oryx-address-list>`
      );

      expect(callback).toHaveBeenCalled();
    });

    it('should emit address change event with selected address', async () => {
      const callback = (e: CustomEvent): void => {
        expect(e.detail).toHaveProperty('address');
      };

      element = await fixture(
        html`<oryx-address-list
          @oryx.address-change=${callback}
          .options=${{ selectable: true }}
        ></oryx-address-list>`
      );
    });
  });
});
