import { CartService } from '@spryker-oryx/cart';
import {
  mockNormalizedCheckoutData,
  mockNormalizedPaymentMethods,
  mockNormalizedUpdatedCheckoutData,
} from '@spryker-oryx/checkout/mocks';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { Observable, of } from 'rxjs';
import { CheckoutAdapter } from '../adapter';
import { CheckoutPaymentService } from './checkout-payment.service';
import { DefaultCheckoutPaymentService } from './default-checkout-payment.service';

class MockCartService implements Partial<CartService> {
  getCart = vi.fn().mockReturnValue(of({ id: 'mockcartid' }));
}

class MockCheckoutAdapter implements Partial<CheckoutAdapter> {
  get = vi.fn().mockReturnValue(of(mockNormalizedCheckoutData));
  update = vi.fn().mockReturnValue(of(mockNormalizedUpdatedCheckoutData));
}

describe('DefaultCheckoutPaymentService', () => {
  let service: CheckoutPaymentService;
  let adapter: MockCheckoutAdapter;

  const callback = vi.fn();
  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: CartService,
          useClass: MockCartService,
        },
        {
          provide: CheckoutAdapter,
          useClass: MockCheckoutAdapter,
        },
        {
          provide: CheckoutPaymentService,
          useClass: DefaultCheckoutPaymentService,
        },
      ],
    });

    service = testInjector.inject(CheckoutPaymentService);
    adapter = testInjector.inject(
      CheckoutAdapter
    ) as unknown as MockCheckoutAdapter;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultCheckoutPaymentService);
  });

  describe('when getPaymentMethods is called', () => {
    it('should return an observable', () => {
      expect(service.getMethods()).toBeInstanceOf(Observable);
    });

    it('should get payment methods for current cart', () => {
      service.getMethods().subscribe(callback);
      expect(callback).toHaveBeenCalledWith(mockNormalizedPaymentMethods);
    });

    describe('when user id or cart id is missing', () => {
      beforeEach(() => {
        adapter.get.mockReturnValue(of({}));
      });

      it('should not return payment methods', () => {
        service.getMethods().subscribe(callback);
        expect(callback).toHaveBeenCalledWith(null);
      });
    });
  });
});
