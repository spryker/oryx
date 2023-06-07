import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { SemanticLinkService } from '@spryker-oryx/site';
import {
  AddressService,
  AddressStateService,
  CrudState,
} from '@spryker-oryx/user';
import { html } from 'lit';
import { BehaviorSubject, of } from 'rxjs';
import { UserAddressFormComponent } from '../address-form';
import { UserAddressEditComponent } from './address-edit.component';
import { addressEditComponent } from './address-edit.def';

class MockAddressService implements Partial<AddressService> {
  getAddress = vi.fn().mockReturnValue(of({}));
  updateAddress = vi.fn().mockReturnValue(of(null));
  addAddress = vi.fn().mockReturnValue(of(null));
  getAddresses = vi.fn();
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
class MockSemanticLinkService implements Partial<SemanticLinkService> {
  get = vi.fn().mockReturnValue(of('/link'));
}

describe('UserAddressEditComponent', () => {
  let element: UserAddressEditComponent;
  let addressService: MockAddressService;
  let form: UserAddressFormComponent;

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
          provide: SemanticLinkService,
          useClass: MockSemanticLinkService,
        },
      ],
    });
    addressService = testInjector.inject(
      AddressService
    ) as unknown as MockAddressService;
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when back button is clicked', () => {
    const callback = vi.fn();

    beforeEach(async () => {
      element = await fixture(html`
        <oryx-user-address-edit @oryx.back=${callback}></oryx-user-address-edit>
      `);
      element.renderRoot
        .querySelector('oryx-button[outline] button')
        ?.dispatchEvent(new CustomEvent('click'));
    });

    it('should dispatch oryx.back event', () => {
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('when back button is clicked', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-address-edit></oryx-user-address-edit>`
      );
      form = element.renderRoot.querySelector(
        'oryx-user-address-form'
      ) as UserAddressFormComponent;
      form.submit = vi.fn();
      element.renderRoot
        .querySelector('oryx-button:not([outline]) button')
        ?.dispatchEvent(new CustomEvent('click'));
    });

    it('should submit the form', () => {
      expect(form.submit).toHaveBeenCalled();
    });
  });

  describe('when form is submitted without addressId', () => {
    const callback = vi.fn();
    const values = { test: 'test' };

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-address-edit
          @oryx.success=${callback}
        ></oryx-user-address-edit>`
      );
      form = element.renderRoot.querySelector(
        'oryx-user-address-form'
      ) as UserAddressFormComponent;
      form.dispatchEvent(
        new CustomEvent('oryx.submit', { detail: { values } })
      );
    });

    it('should dispatch oryx.success event', () => {
      expect(callback).toHaveBeenCalled();
    });

    it('should merge fields and add new address', () => {
      expect(addressService.addAddress).toHaveBeenCalledWith({
        ...values,
        isDefaultShipping: false,
        isDefaultBilling: false,
      });
    });
  });

  describe('when addressId is provided', () => {
    const callback = vi.fn();
    const values = { test: 'test' };
    const addressId = 'testId';

    beforeEach(async () => {
      addressService.getAddress = vi.fn().mockReturnValue(of(values));
      element = await fixture(
        html`<oryx-user-address-edit
          .addressId=${addressId}
          @oryx.success=${callback}
        ></oryx-user-address-edit>`
      );
      form = element.renderRoot.querySelector(
        'oryx-user-address-form'
      ) as UserAddressFormComponent;
      form.dispatchEvent(
        new CustomEvent('oryx.submit', { detail: { values } })
      );
    });

    it('should dispatch oryx.success event', () => {
      expect(callback).toHaveBeenCalled();
    });

    it('should pass address to the form values', () => {
      expect(form.values).toEqual(values);
    });

    it('should merge fields and update address', () => {
      expect(addressService.updateAddress).toHaveBeenCalledWith({
        ...values,
        isDefaultShipping: false,
        isDefaultBilling: false,
        id: addressId,
      });
    });
  });
});
