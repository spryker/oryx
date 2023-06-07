import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { AddressStateService } from './address-state.service';
import { DefaultAddressStateService } from './default-address-state.service';

describe('DefaultAddressStateService', () => {
  let service: AddressStateService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: AddressStateService,
          useClass: DefaultAddressStateService,
        },
      ],
    });

    service = testInjector.inject(AddressStateService);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultAddressStateService);
  });
});
