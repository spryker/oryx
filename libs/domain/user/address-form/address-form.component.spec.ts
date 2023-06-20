import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { FormRenderer } from '@spryker-oryx/form';
import { CountryService } from '@spryker-oryx/site';
import {
  Address,
  AddressFormService,
  AddressService,
  User,
  UserService,
} from '@spryker-oryx/user';
import { html } from 'lit';
import { of } from 'rxjs';
import { UserAddressFormComponent } from './address-form.component';
import { userAddressFormComponent } from './address-form.def';

class MockFormRenderer implements Partial<FormRenderer> {
  buildForm = vi.fn().mockReturnValue(html``);
}

const mockCountries = [
  {
    iso2Code: 'DE',
    name: 'Germany',
  },
  {
    iso2Code: 'US',
    name: 'United States',
  },
];

class MockAddressService implements Partial<AddressService> {
  getCurrent = vi.fn().mockReturnValue(of(null));
  getList = vi.fn().mockReturnValue(
    of([
      {
        id: 'sampleAddress',
        isDefaultBilling: true,
        isDefaultShipping: true,
      } as Address,
    ])
  );
}

class MockCountryService {
  get = vi.fn().mockReturnValue(of({ iso2Code: 'DE', name: 'Germany' }));
  getAll = vi.fn().mockReturnValue(
    of([
      {
        iso2Code: 'DE',
        name: 'Germany',
      },
      {
        iso2Code: 'US',
        name: 'United States',
      },
    ])
  );
  set = vi.fn().mockReturnValue('DE');
}

const mockForm = {
  id: 'DE',
  name: 'Germany',
  data: {
    options: [
      {
        id: 'mockField',
        title: 'Mock',
        label: '',
        type: 'input',
        required: true,
      },
    ],
  },
};

const mockFallbackForm = {
  id: 'PT',
  name: 'Portugal',
  data: {
    options: [
      {
        id: 'mockField',
        title: 'Mock',
        label: '',
        type: 'input',
        required: true,
      },
    ],
  },
};

class MockAddressFormService implements Partial<AddressFormService> {
  getForm = vi.fn().mockReturnValue(of(mockForm));
}

class MockUserService implements Partial<UserService> {
  getUser = vi.fn().mockReturnValue(of(null));
}

describe('UserAddressFormComponent', () => {
  let element: UserAddressFormComponent;
  let renderer: MockFormRenderer;
  let formService: MockAddressFormService;
  let countryService: MockCountryService;
  let addressService: MockAddressService;
  let userService: MockUserService;

  let selectElement: HTMLSelectElement | undefined | null;

  beforeAll(async () => {
    await useComponent(userAddressFormComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: FormRenderer,
          useClass: MockFormRenderer,
        },
        {
          provide: CountryService,
          useClass: MockCountryService,
        },
        {
          provide: AddressFormService,
          useClass: MockAddressFormService,
        },
        {
          provide: AddressService,
          useClass: MockAddressService,
        },
        {
          provide: UserService,
          useClass: MockUserService,
        },
      ],
    });
    renderer = testInjector.inject<MockFormRenderer>(FormRenderer);
    formService =
      testInjector.inject<MockAddressFormService>(AddressFormService);
    countryService = testInjector.inject<MockCountryService>(CountryService);
    addressService = testInjector.inject<MockAddressService>(AddressService);
    userService = testInjector.inject<MockUserService>(UserService);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when the address form is rendered', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-address-form></oryx-user-address-form>`
      );
    });

    it('is defined', () => {
      expect(element).toBeInstanceOf(UserAddressFormComponent);
    });

    it('should load json form', () => {
      expect(formService.getForm).toHaveBeenCalledWith({
        country: 'DE',
        fallbackCountry: 'DE',
      });
      expect(renderer.buildForm).toHaveBeenCalledWith(
        mockForm.data.options,
        {}
      );
    });

    it('should have options for available countries', () => {
      const options = element.shadowRoot?.querySelectorAll(
        'select[name="iso2Code"] option'
      );
      expect(options?.length).toBe(2);
      expect((options?.[0] as HTMLInputElement).value).toBe('DE');
    });
  });

  describe('when the selected country does not exist, but fallback country does exist', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-address-form
          country="FR"
          .options=${{ fallbackCountry: 'PT' }}
        ></oryx-user-address-form>`
      );
    });

    it('should load the form for the fallback country', () => {
      expect(formService.getForm).toHaveBeenCalledWith({
        country: 'FR',
        fallbackCountry: 'PT',
      });
    });

    it('should render fallback country form', () => {
      expect(renderer.buildForm).toHaveBeenCalledWith(
        mockFallbackForm.data.options,
        {}
      );
    });
  });

  describe('when selected country changes', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-address-form></oryx-user-address-form>`
      );
      selectElement = element.shadowRoot?.querySelector('select');

      if (selectElement) {
        selectElement.value = 'US';
        selectElement.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    it('should select second option', () => {
      expect(countryService.set).toHaveBeenCalledWith('US');
    });
  });

  describe('when only one country is available', () => {
    beforeEach(async () => {
      countryService.getAll.mockReturnValue(of([mockCountries[0]]));
      element = await fixture(
        html`<oryx-user-address-form></oryx-user-address-form>`
      );
    });

    it('should not display country select when only one country is available', () => {
      const select = element.shadowRoot?.querySelector(
        'select[name="iso2Code"]'
      );
      expect(select).toBeNull();
    });
  });

  describe('when country attribute is defined', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-user-address-form country="US"></oryx-user-address-form>`
      );
    });

    it('should display the correct country in the country select', () => {
      const selected: HTMLOptionElement | null | undefined =
        element.shadowRoot?.querySelector(
          'select[name="iso2Code"] option[selected]'
        );

      expect(selected?.value).toBe('US');
    });

    it('should load the form for the specified country', () => {
      expect(formService.getForm).toHaveBeenCalledWith({
        country: 'US',
        fallbackCountry: 'DE',
      });
    });
  });

  describe('when a logged in user has an address', () => {
    beforeEach(async () => {
      addressService.getCurrent.mockReturnValue(of({ iso2Code: 'US' }));
      element = await fixture(
        html`<oryx-user-address-form></oryx-user-address-form>`
      );
    });

    it("should select the country from the user's saved address", () => {
      const selected: HTMLOptionElement | null | undefined =
        element.shadowRoot?.querySelector(
          'select[name="iso2Code"] option[selected]'
        );
      expect(addressService.getCurrent).toHaveBeenCalled();
      expect(selected?.value).toBe('US');
    });
  });

  describe('when isDefaultShipping prop is provided', () => {
    beforeEach(async () => {
      element = await fixture(html` <oryx-user-address-form
        enableDefaultShipping
      ></oryx-user-address-form>`);
    });

    it('should merge the field with the form schema', () => {
      expect(renderer.buildForm).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: 'isDefaultShipping' }),
        ]),
        {}
      );
    });

    describe('and there is an address available with is set to default shipping', () => {
      beforeEach(async () => {
        addressService.getList.mockReturnValue(
          of([{ isDefaultShipping: true } as Address])
        );
        element = await fixture(html` <oryx-user-address-form
          enableDefaultShipping
        ></oryx-user-address-form>`);
      });

      it('should not set isDefaultShipping to true in the default values', () => {
        expect(renderer.buildForm).toHaveBeenCalledWith(
          expect.anything(),
          expect.not.objectContaining({ isDefaultShipping: true })
        );
      });
    });

    describe('and there is no address available with is set to default billing', () => {
      beforeEach(async () => {
        addressService.getList.mockReturnValue(of([]));
        element = await fixture(html` <oryx-user-address-form
          enableDefaultShipping
        ></oryx-user-address-form>`);
      });

      it('should set isDefaultShipping to true in the default values', () => {
        expect(renderer.buildForm).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({ isDefaultShipping: true })
        );
      });
    });
  });

  describe('when enableDefaultBilling property is provided', () => {
    beforeEach(async () => {
      element = await fixture(html` <oryx-user-address-form
        enableDefaultBilling
      ></oryx-user-address-form>`);
    });

    it('should add the field to the form model', () => {
      expect(renderer.buildForm).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: 'isDefaultBilling' }),
        ]),
        {}
      );
    });

    describe('and there is an address available with is set to default billing', () => {
      beforeEach(async () => {
        addressService.getList.mockReturnValue(
          of([{ isDefaultBilling: true } as Address])
        );
        element = await fixture(html` <oryx-user-address-form
          enableDefaultBilling
        ></oryx-user-address-form>`);
      });

      it('should not set isDefaultBilling to true in the default values', () => {
        expect(renderer.buildForm).toHaveBeenCalledWith(
          expect.anything(),
          expect.not.objectContaining({ isDefaultBilling: true })
        );
      });
    });

    describe('and there is no address available with is set to default billing', () => {
      beforeEach(async () => {
        addressService.getList.mockReturnValue(of([]));
        element = await fixture(html` <oryx-user-address-form
          enableDefaultBilling
        ></oryx-user-address-form>`);
      });

      it('should set isDefaultBilling to true in the default values', () => {
        expect(renderer.buildForm).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({ isDefaultBilling: true })
        );
      });
    });
  });

  describe('when values are provided', () => {
    const values = { mockField: 'test' };
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-user-address-form .values=${values}></oryx-user-address-form>
      `);
    });

    it('should pass values to the buildForm', () => {
      expect(renderer.buildForm).toHaveBeenCalledWith(
        mockForm.data.options,
        values
      );
    });
  });

  describe('when a registered user creates a new address', () => {
    const user = {
      firstName: 'First',
      lastName: 'Last',
      salutation: 'Mr',
    } as User;
    beforeEach(async () => {
      userService.getUser.mockReturnValue(of(user));
      element = await fixture(html`
        <oryx-user-address-form></oryx-user-address-form>
      `);
    });

    it('should feed in the user`s data', () => {
      expect(renderer.buildForm).toHaveBeenCalledWith(expect.anything(), user);
    });
  });
});
