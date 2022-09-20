import { CartService } from '@spryker-oryx/cart';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { Observable, of } from 'rxjs';
import {
  mockNormalizedCheckoutData,
  mockNormalizedUpdatedCheckoutData,
  mockShipmentAttributes,
} from '../mocks/mock-checkout';
import { Shipment } from '../models';
import { CheckoutAdapter } from './adapter';
import { CheckoutService } from './checkout.service';
import { DefaultCheckoutService } from './default-checkout.service';

const mockCartId = 'mockcartid';

class MockCartService implements Partial<CartService> {
  getCart = vi.fn();
}

class MockCheckoutAdapter implements Partial<CheckoutAdapter> {
  get = vi.fn().mockReturnValue(of(mockNormalizedCheckoutData));
  update = vi.fn().mockReturnValue(of(mockNormalizedUpdatedCheckoutData));
}

describe('DefaultCheckoutService', () => {
  let service: CheckoutService;
  let cart: MockCartService;
  let adapter: MockCheckoutAdapter;
  let shipments$: Observable<Shipment[] | null>;
  const callback = vi.fn();
  const shipmentsCallback = vi.fn();
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
          provide: CheckoutService,
          useClass: DefaultCheckoutService,
        },
      ],
    });

    service = testInjector.inject(CheckoutService);
    cart = testInjector.inject(CartService) as unknown as MockCartService;
    adapter = testInjector.inject(
      CheckoutAdapter
    ) as unknown as MockCheckoutAdapter;

    cart.getCart.mockReturnValue(of({ id: mockCartId }));
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultCheckoutService);
  });

  describe('getShipments', () => {
    it('should return an observable', () => {
      expect(service.getShipments()).toBeInstanceOf(Observable);
    });

    it('should get shipments for current cart', () => {
      service.getShipments().subscribe(callback);

      expect(callback).toHaveBeenCalledWith([mockShipmentAttributes]);
    });

    it('should not return shipments if user id or cart id is missing', () => {
      adapter.get.mockReturnValue(of({}));

      service.getShipments().subscribe(callback);
      expect(callback).toHaveBeenCalledWith(null);
    });
  });

  describe('setShipmentMethod', () => {
    it('should return an observable', () => {
      expect(
        service.setShipmentMethod(1, mockShipmentAttributes)
      ).toBeInstanceOf(Observable);
    });

    it('should update selected shipment method', () => {
      shipments$ = service.getShipments();

      shipments$.subscribe(shipmentsCallback);
      service.setShipmentMethod(1, mockShipmentAttributes).subscribe(callback);

      expect(callback).toHaveBeenCalledWith(
        mockNormalizedUpdatedCheckoutData.shipments
      );
      expect(shipmentsCallback).toHaveBeenCalledWith(
        mockNormalizedUpdatedCheckoutData.shipments
      );
    });
  });
});
