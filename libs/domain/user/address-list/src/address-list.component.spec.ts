import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { TileComponent } from '@spryker-oryx/ui/tile';
import { AddressService } from '@spryker-oryx/user';
import { mockAddress, mockCurrentAddress } from '@spryker-oryx/user/mocks';
import { html } from 'lit';
import { of } from 'rxjs';
import { AddressListComponent } from './address-list.component';
import { addressListComponent } from './address-list.def';

class MockAddressService implements Partial<AddressService> {
  getAddresses = vi.fn().mockReturnValue(of([mockCurrentAddress, mockAddress]));
}

describe('AddressListComponent', () => {
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

    element = await fixture(html`<oryx-address-list></oryx-address-list>`);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe('when has not addresses', () => {
    beforeEach(async () => {
      service.getAddresses.mockReturnValue(of(null));
      element = await fixture(html`<oryx-address-list></oryx-address-list>`);
    });

    it('should render empty slot', async () => {
      expect(element).toContainElement('slot[name="empty"]');
    });
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

    it('should emit select event', () => {
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { address: expect.any(Object) } })
      );
    });

    describe('and selected address was changed', () => {
      beforeEach(async () => {
        (
          element.renderRoot.querySelector(
            'oryx-tile:nth-child(2) input'
          ) as HTMLInputElement
        ).dispatchEvent(new InputEvent('change'));

        element.requestUpdate();
        await elementUpdated(element);
      });

      it('should select the second address', () => {
        expect(
          (
            element.renderRoot.querySelector(
              'oryx-tile:nth-child(2)'
            ) as TileComponent
          ).hasAttribute('selected')
        ).toBe(true);
      });
    });
  });
});
