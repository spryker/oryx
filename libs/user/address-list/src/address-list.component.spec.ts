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

  describe('when "selectable" option is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-address-list
          .options=${{
            selectable: true,
          }}
        ></oryx-address-list>`
      );
    });

    it('should render radio button', async () => {
      expect(element).toContainElement('input[type="radio"]');
    });
  });

  describe('when "editable" option is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-address-list
          .options=${{
            editable: true,
          }}
        ></oryx-address-list>`
      );
    });

    it('should render controls', async () => {
      expect(element).toContainElement('.controls');
    });
  });

  describe('when addresses are not provided', () => {
    const callback = vi.fn();

    beforeEach(async () => {
      service.getAddresses.mockReturnValue(of(null));
      element = await fixture(
        html`<oryx-address-list
          @oryx.select=${callback}
          .options=${{ selectable: true }}
        ></oryx-address-list>`
      );
    });

    it('should not emit select event', () => {
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('when addresses are provided', () => {
    const callback = vi.fn();

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-address-list
          @oryx.select=${callback}
          .options=${{ selectable: true }}
        ></oryx-address-list>`
      );
    });

    it('should not emit select event', () => {
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { address: expect.any(Object) } })
      );
    });
  });

  describe('when edit button is clicked', () => {
    const callback = vi.fn();

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-address-list
          @oryx.edit=${callback}
          .options=${{ editable: true }}
        ></oryx-address-list>`
      );

      (
        element.renderRoot.querySelector(
          'oryx-button:nth-child(1) > button'
        ) as HTMLButtonElement
      )?.click();
    });

    it('should emit edit event', () => {
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('when remove button is clicked', () => {
    const callback = vi.fn();

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-address-list
          @oryx.remove=${callback}
          .options=${{ editable: true }}
        ></oryx-address-list>`
      );

      (
        element.renderRoot.querySelector(
          'oryx-button:nth-child(2) > button'
        ) as HTMLButtonElement
      )?.click();
    });

    it('should emit remove event', () => {
      expect(callback).toHaveBeenCalled();
    });
  });
});
