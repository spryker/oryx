import {
  CheckoutService,
  DefaultCheckoutService,
} from '@spryker-oryx/checkout';
import { createInjector, destroyInjector } from '@spryker-oryx/di';

describe('DefaultCheckoutService', () => {
  let service: CheckoutService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: CheckoutService,
          useClass: DefaultCheckoutService,
        },
      ],
    });

    service = testInjector.inject(CheckoutService);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultCheckoutService);
  });
});
