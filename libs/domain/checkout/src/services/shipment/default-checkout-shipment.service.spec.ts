import { Cart, CartService } from '@spryker-oryx/cart';
import {
  mockNormalizedCheckoutData,
  mockNormalizedUpdatedCheckoutData,
} from '@spryker-oryx/checkout/mocks';
import { StorageService, StorageType } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { BehaviorSubject, of, take } from 'rxjs';
import { Carrier, shipmentCheckoutStorageKey } from '../../models';
import { CheckoutAdapter } from '../adapter';
import { CheckoutShipmentService } from './checkout-shipment.service';
import { DefaultCheckoutShipmentService } from './default-checkout-shipment.service';

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

describe('DefaultCheckoutShipmentService', () => {
  let service: CheckoutShipmentService;
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
          provide: CheckoutShipmentService,
          useClass: DefaultCheckoutShipmentService,
        },
        {
          provide: StorageService,
          useClass: MockStorageService,
        },
      ],
    });

    adapter = injector.inject<MockCheckoutAdapter>(CheckoutAdapter);
    cartService = injector.inject<MockCartService>(CartService);
    storageService = injector.inject<MockStorageService>(StorageService);
    service = injector.inject(CheckoutShipmentService);
  });

  afterEach(() => {
    cart.next(null);
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultCheckoutShipmentService);
  });

  describe('when the cart is null', () => {
    beforeEach(() => {
      cartService.getCart.mockReturnValue(of(null));
      service.getCarriers().pipe(take(1)).subscribe();
    });

    it('should not load any methods', () => {
      expect(adapter.get).not.toHaveBeenCalled();
    });
  });

  describe('when there are no items in the cart', () => {
    beforeEach(() => {
      cart.next(mockEmptyCart);
      service.getCarriers().pipe(take(1)).subscribe();
    });

    it('should not load any methods', () => {
      expect(adapter.get).not.toHaveBeenCalled();
    });
  });

  describe('when there are items in the cart', () => {
    beforeEach(() => {
      cart.next(mockCartWithEntries);
      service.getCarriers().pipe(take(1)).subscribe();
    });

    it('should load methods', () => {
      expect(adapter.get).toHaveBeenCalled();
    });

    describe('and there are no methods available', () => {
      let result: unknown;
      beforeEach(() => {
        cart.next(mockCartWithEntries);
        adapter.get.mockReturnValue({});
        service
          .getCarriers()
          .pipe(take(1))
          .subscribe((r) => (result = r));
      });

      it('should not load any methods', () => {
        expect(result).toBeNull();
      });
    });

    describe('and there are carriers available', () => {
      let result: Carrier[] | null;
      beforeEach(() => {
        cart.next(mockCartWithEntries);
        service
          .getCarriers()
          .pipe(take(1))
          .subscribe((r) => (result = r));
      });

      it('should load the carriers', () => {
        expect(result).toBe(mockNormalizedCheckoutData.shipments[0].carriers);
      });
    });
  });

  describe('when select() is called', () => {
    const mockMethod =
      mockNormalizedCheckoutData.shipments[0].carriers[0].shipmentMethods[0];
    beforeEach(() => {
      service.select(mockMethod.id);
    });

    it('should store the method', () => {
      expect(storageService.set).toHaveBeenCalledWith(
        shipmentCheckoutStorageKey,
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
        shipmentCheckoutStorageKey,
        StorageType.SESSION
      );
    });
  });
});
