import { fixture } from '@open-wc/testing-helpers';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { useComponent } from '@spryker-oryx/core/utilities';
import { FormRenderer } from '@spryker-oryx/form';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { CountryService } from '@spryker-oryx/site';
import { AddressFormService } from '@spryker-oryx/user';
import { html } from 'lit';
import { of } from 'rxjs';
import { AddressFormComponent } from './address-form.component';
import { addressFormComponent } from './address-form.def';

class MockFormRenderer implements Partial<FormRenderer> {
  buildForm = vi.fn().mockReturnValue(html``);
}

class MockCountryService {
  get = vi.fn().mockReturnValue(
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
      ],
    });
    renderer = testInjector.inject(FormRenderer) as unknown as MockFormRenderer;
    formService = testInjector.inject(
      AddressFormService
    ) as unknown as MockAddressFormService;

    element = await fixture(html`<oryx-address-form></oryx-address-form>`);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
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
