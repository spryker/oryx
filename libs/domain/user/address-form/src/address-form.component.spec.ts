import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { FormRenderer } from '@spryker-oryx/form';
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

describe('AddressFormComponent', () => {
  let element: AddressFormComponent;
  let renderer: MockFormRenderer;
  let formService: MockAddressFormService;
  let countryService: MockCountryService;
  let addressService: MockAddressService;

  let selectElement: HTMLSelectElement | undefined | null;

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
      expect(formService.getForm).toHaveBeenCalledWith({
        country: 'DE',
        fallbackCountry: 'DE',
      });
      expect(renderer.buildForm).toHaveBeenCalledWith(
        mockForm.data.options,
        undefined
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
        html`<oryx-address-form
          country="FR"
          fallbackCountry="PT"
        ></oryx-address-form>`
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
        undefined
      );
    });
  });

  describe('when selected country changes', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-address-form></oryx-address-form>`);
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
      element = await fixture(html`<oryx-address-form></oryx-address-form>`);
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
        html`<oryx-address-form country="US"></oryx-address-form>`
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
      addressService.getCurrentAddress.mockReturnValue(of({ iso2Code: 'US' }));
      element = await fixture(html`<oryx-address-form></oryx-address-form>`);
    });
    it("should select the country from the user's saved address", () => {
      const selected: HTMLOptionElement | null | undefined =
        element.shadowRoot?.querySelector(
          'select[name="iso2Code"] option[selected]'
        );
      expect(addressService.getCurrentAddress).toHaveBeenCalled();
      expect(selected?.value).toBe('US');
    });
  });

  describe('when isDefaultShipping prop is provided', () => {
    beforeEach(async () => {
      element = await fixture(html` <oryx-address-form
        enableDefaultShipping
      ></oryx-address-form>`);
    });

    it('should merge the field with the form schema', () => {
      expect(renderer.buildForm).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: 'isDefaultShipping' }),
        ]),
        undefined
      );
    });
  });

  describe('when enableDefaultBilling prop is provided', () => {
    beforeEach(async () => {
      element = await fixture(html` <oryx-address-form
        enableDefaultBilling
      ></oryx-address-form>`);
    });

    it('should merge the field with the form schema', () => {
      expect(renderer.buildForm).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: 'isDefaultBilling' }),
        ]),
        undefined
      );
    });
  });

  describe('when values are provided', () => {
    const values = { mockField: 'test' };
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-address-form .values=${values}></oryx-address-form>
      `);
    });

    it('should pass values to the buildForm', () => {
      expect(renderer.buildForm).toHaveBeenCalledWith(
        mockForm.data.options,
        values
      );
    });
  });
});
