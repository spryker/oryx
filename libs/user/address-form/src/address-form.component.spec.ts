import { fixture } from '@open-wc/testing-helpers';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { useComponent } from '@spryker-oryx/core/utilities';
import { FormRenderer } from '@spryker-oryx/form';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { CountryService } from '@spryker-oryx/site';
import { AddressFormService, AddressService } from '@spryker-oryx/user';
import { html } from 'lit';
import { of } from 'rxjs';
import { AddressFormComponent } from './address-form.component';
import { addressFormComponent } from './address-form.def';

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
  getCurrentAddress = vi.fn().mockReturnValue(of(null));
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
}

const mockForm = {
  id: 'DE',
  name: 'Germany',
  data: {
    options: [
      {
        id: 'mockfield',
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

describe('AddressFormComponent', () => {
  let element: AddressFormComponent;
  let http: HttpTestService;
  let renderer: MockFormRenderer;
  let formService: MockAddressFormService;
  let countryService: MockCountryService;
  let addressService: MockAddressService;

  beforeAll(async () => {
    await useComponent(addressFormComponent);
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
      ],
    });
    renderer = testInjector.inject(FormRenderer) as unknown as MockFormRenderer;
    formService = testInjector.inject(
      AddressFormService
    ) as unknown as MockAddressFormService;
    countryService = testInjector.inject(
      CountryService
    ) as unknown as MockCountryService;
    addressService = testInjector.inject(
      AddressService
    ) as unknown as MockAddressService;
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when the address form is rendered', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-address-form></oryx-address-form>`);
    });

    it('is defined', () => {
      expect(element).toBeInstanceOf(AddressFormComponent);
    });

    it('should load json form', () => {
      expect(formService.getForm).toHaveBeenCalledWith({ country: 'DE' });
      expect(renderer.buildForm).toHaveBeenCalledWith(mockForm.data.options);
    });

    it('should have options for available countries', () => {
      const options = element.shadowRoot?.querySelectorAll(
        'select[name="country"] option'
      );
      expect(options?.length).toBe(2);
      expect((options?.[0] as HTMLInputElement).value).toBe('DE');
    });
  });

  describe('when the selected country does not exist', () => {
    beforeEach(async () => {
      formService.getForm.mockReturnValue(of(null));
      element = await fixture(
        html`<oryx-address-form country="US"></oryx-address-form>`
      );
    });
    it('should not render a form', () => {
      expect(renderer.buildForm).not.toHaveBeenCalled();
    });
  });

  describe('when only one country is available', () => {
    beforeEach(async () => {
      countryService.getAll.mockReturnValue(of([mockCountries[0]]));
      element = await fixture(html`<oryx-address-form></oryx-address-form>`);
    });
    it('should not display country select when only one country is available', () => {
      const select = element.shadowRoot?.querySelector(
        'select[name="country"]'
      );

      expect(select).toBeNull();
    });
  });

  describe('when country attribute is defined', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-address-form country="US"></oryx-address-form>`
      );
    });

    it('should display the correct country in the country select', () => {
      const selected: HTMLOptionElement | null | undefined =
        element.shadowRoot?.querySelector(
          'select[name="country"] option[selected]'
        );

      expect(selected?.value).toBe('US');
    });

    it('should load the form for the specified country', () => {
      expect(formService.getForm).toHaveBeenCalledWith({ country: 'US' });
    });
  });
  describe('when a logged in user has an address', () => {
    beforeEach(async () => {
      addressService.getCurrentAddress.mockReturnValue(of({ iso2Code: 'US' }));
      element = await fixture(html`<oryx-address-form></oryx-address-form>`);
    });
    it("should select the country from the user's saved address", () => {
      const selected: HTMLOptionElement | null | undefined =
        element.shadowRoot?.querySelector(
          'select[name="country"] option[selected]'
        );
      expect(addressService.getCurrentAddress).toHaveBeenCalled();
      expect(selected?.value).toBe('US');
    });
  });
});
