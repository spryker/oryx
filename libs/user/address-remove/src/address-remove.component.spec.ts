import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { AddressService } from '@spryker-oryx/user';
import { mockCurrentAddress } from '@spryker-oryx/user/mocks';
import { html } from 'lit';
import { of } from 'rxjs';
import { AddressRemoveComponent } from './address-remove.component';
import { addressRemoveComponent } from './address-remove.def';

class MockAddressService implements Partial<AddressService> {
  getAddress = vi.fn().mockReturnValue(of(mockCurrentAddress));
}

describe('AddressRemoveComponent', () => {
  let element: AddressRemoveComponent;
  let service: MockAddressService;

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
      ],
    });

    service = testInjector.inject(
      AddressService
    ) as unknown as MockAddressService;

    element = await fixture(html`<oryx-user-address-remove
      addressId="currentaddressid"
    ></oryx-user-address-remove>`);
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
        html`<oryx-user-address-remove></oryx-user-address-remove>`
      );
    });

    it('should not render inner content', () => {
      expect(element).not.toContainElement('oryx-user-address');
    });
  });

  describe('when no address', () => {
    beforeEach(async () => {
      service.getAddress.mockReturnValue(of(null));

      element = await fixture(
        html`<oryx-user-address-remove
          addressId="currentaddressid"
        ></oryx-user-address-remove>`
      );
    });

    it('should not render inner content', () => {
      expect(element).not.toContainElement('oryx-user-address');
    });
  });

  describe('when address is rendered', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-address-remove
          addressId="currentaddressid"
        ></oryx-user-address-remove>`
      );
    });

    it('should render content', () => {
      expect(element).toContainElement('oryx-user-address');
    });

    it('should render section', () => {
      expect(element).toContainElement('section');
    });

    it('should render controls', () => {
      expect(element).toContainElement('oryx-button');
    });
  });

  describe('when cancel button is clicked', () => {
    const callback = vi.fn();

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-address-remove
          addressId="currentaddressid"
          @oryx.cancel=${callback}
        ></oryx-user-address-remove>`
      );

      (
        element.renderRoot.querySelector('button') as HTMLButtonElement
      )?.click();
    });

    it('should emit the event without address', () => {
      expect(callback).toHaveBeenCalledWith(
        expect.not.objectContaining({ detail: { address: mockCurrentAddress } })
      );
    });
  });

  describe('when confirm button is clicked', () => {
    const callback = vi.fn();

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-address-remove
          addressId="currentaddressid"
          @oryx.confirm=${callback}
        ></oryx-user-address-remove>`
      );

      (
        element.renderRoot.querySelector(
          'oryx-button:nth-child(2) > button'
        ) as HTMLButtonElement
      )?.click();
    });

    it('should emit the event with address', () => {
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { address: mockCurrentAddress } })
      );
    });
  });
});
