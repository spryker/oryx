import { ErrorService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { AddressForm } from '../../address-form';
import { AddressFormAdapter } from './adapter';
import { AddressFormService } from './address-form.service';
import { DefaultAddressFormService } from './default-address-form.service';

const mockForm: AddressForm = {
  id: 'DE',
  name: 'Germany',
  data: {
    options: [],
  },
};

class MockAddressFormAdapter implements Partial<AddressFormAdapter> {
  get = vi.fn().mockReturnValue(of(mockForm));
}

class MockErrorService implements Partial<ErrorService> {
  dispatchError = vi.fn();
}

describe('DefaultAddressFormService', () => {
  let service: DefaultAddressFormService;
  let adapter: MockAddressFormAdapter;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: AddressFormService,
          useClass: DefaultAddressFormService,
        },
        {
          provide: AddressFormAdapter,
          useClass: MockAddressFormAdapter,
        },
        {
          provide: ErrorService,
          useClass: MockErrorService,
        },
      ],
    });

    service = testInjector.inject(
      AddressFormService
    ) as DefaultAddressFormService;
    adapter = testInjector.inject(AddressFormAdapter) as MockAddressFormAdapter;
  });

  afterEach(() => {
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultAddressFormService);
  });

  it('should retrieve form for a specific country', () => {
    const callback = vi.fn();
    service.getForm({ country: 'DE' }).subscribe(callback);

    expect(callback).toHaveBeenCalledWith(mockForm);
    expect(adapter.get).toHaveBeenCalledWith({ country: 'DE' });
  });
});
