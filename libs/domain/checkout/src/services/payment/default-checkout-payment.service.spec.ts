import { Cart, CartService } from '@spryker-oryx/cart';
import {
  mockNormalizedCheckoutData,
  mockNormalizedUpdatedCheckoutData,
} from '@spryker-oryx/checkout/mocks';
import { StorageService, StorageType } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { BehaviorSubject, of, take } from 'rxjs';
import { paymentCheckoutStorageKey, PaymentMethod } from '../../models';
import { CheckoutAdapter } from '../adapter';
import { CheckoutPaymentService } from './checkout-payment.service';
import { DefaultCheckoutPaymentService } from './default-checkout-payment.service';

const mockEmptyCart = { id: 'mock-cart-id', products: [] } as unknown as Cart;
const mockCartWithEntries = {
  id: 'mock-cart-id',
  products: [{ sku: '123' }],
} as Cart;

const cart = new BehaviorSubject<Cart | null>(null);
class MockCartService implements Partial<CartService> {
  getCart = vi.fn().mockReturnValue(cart);
}

class MockCheckoutAdapter implements Partial<CheckoutAdapter> {
  get = vi.fn().mockReturnValue(of(mockNormalizedCheckoutData));
  update = vi.fn().mockReturnValue(of(mockNormalizedUpdatedCheckoutData));
}

class MockStorageService implements Partial<StorageService> {
  get = vi.fn().mockReturnValue(of({}));
  set = vi.fn().mockReturnValue(of(undefined));
}

describe('DefaultCheckoutPaymentService', () => {
  let service: CheckoutPaymentService;
  let adapter: MockCheckoutAdapter;
  let cartService: MockCartService;
  let storageService: MockStorageService;

  beforeEach(() => {
    const injector = createInjector({
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
        {
          provide: StorageService,
          useClass: MockStorageService,
        },
      ],
    });

    adapter = injector.inject<MockCheckoutAdapter>(CheckoutAdapter);
    cartService = injector.inject<MockCartService>(CartService);
    service = injector.inject(CheckoutPaymentService);
    storageService = injector.inject<MockStorageService>(StorageService);
  });

  afterEach(() => {
    cart.next(null);
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultCheckoutPaymentService);
  });

  describe('when the cart is null', () => {
    beforeEach(() => {
      cartService.getCart.mockReturnValue(of(null));
      service.getMethods().pipe(take(1)).subscribe();
    });

    it('should not load any methods', () => {
      expect(adapter.get).not.toHaveBeenCalled();
    });
  });

  describe('when there are no items in the cart', () => {
    beforeEach(() => {
      cart.next(mockEmptyCart);
      service.getMethods().pipe(take(1)).subscribe();
    });

    it('should not load any methods', () => {
      expect(adapter.get).not.toHaveBeenCalled();
    });
  });

  describe('when there are items in the cart', () => {
    beforeEach(() => {
      cart.next(mockCartWithEntries);
      service.getMethods().pipe(take(1)).subscribe();
    });

    it('should load methods', () => {
      expect(adapter.get).toHaveBeenCalled();
    });

    describe('and there are no paymentMethods available', () => {
      let result: unknown;
      beforeEach(() => {
        cart.next(mockCartWithEntries);
        adapter.get.mockReturnValue({});
        service
          .getMethods()
          .pipe(take(1))
          .subscribe((r) => (result = r));
      });

      it('should not load any methods', () => {
        expect(result).toBeNull();
      });
    });

    describe('and there are paymentMethods available', () => {
      let result: PaymentMethod[] | null;
      beforeEach(() => {
        cart.next(mockCartWithEntries);
        service
          .getMethods()
          .pipe(take(1))
          .subscribe((r) => (result = r));
      });

      it('should load the methods', () => {
        expect(result).toBe(mockNormalizedCheckoutData.paymentMethods);
      });
    });
  });

  describe('when select() is called', () => {
    const mockMethod = mockNormalizedCheckoutData.paymentMethods[1];
    beforeEach(() => {
      service.select(mockMethod.id);
    });

    it('should store the method', () => {
      expect(storageService.set).toHaveBeenCalledWith(
        paymentCheckoutStorageKey,
        mockMethod.id,
        StorageType.SESSION
      );
    });

    describe('and selected() is called', () => {
      let result: unknown;
      beforeEach(async () => {
        cart.next(mockCartWithEntries);
        storageService.get.mockReturnValue(of(mockMethod.id));
        service
          .selected()
          .pipe(take(1))
          .subscribe((r) => (result = r));
      });

      it('should return the selected method', () => {
        expect(result).toBe(mockMethod);
      });
    });
  });

  describe('when selected() is called', () => {
    beforeEach(() => {
      service.selected().pipe(take(1)).subscribe();
    });

    it('should store the method', () => {
      expect(storageService.get).toHaveBeenCalledWith(
        paymentCheckoutStorageKey,
        StorageType.SESSION
      );
    });
  });
});
