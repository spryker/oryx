import { CartService } from '@spryker-oryx/cart';
import {
  mockFilteredShipmentMethods,
  mockNormalizedCheckoutData,
  mockNormalizedShipmentAttributes,
  mockNormalizedUpdatedCheckoutData,
} from '@spryker-oryx/checkout/mocks';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { Observable, of } from 'rxjs';
import { Shipment } from '../models';
import { CheckoutAdapter } from './adapter';
import { CheckoutShipmentService } from './checkout-shipment.service';
import { DefaultCheckoutShipmentService } from './default-checkout-shipment.service';

const mockCartId = 'mockcartid';

class MockCartService implements Partial<CartService> {
  getCart = vi.fn();
}

class MockCheckoutAdapter implements Partial<CheckoutAdapter> {
  get = vi.fn().mockReturnValue(of(mockNormalizedCheckoutData));
  update = vi.fn().mockReturnValue(of(mockNormalizedUpdatedCheckoutData));
}

describe('DefaultCheckoutService', () => {
  let service: CheckoutShipmentService;
  let cart: MockCartService;
  let adapter: MockCheckoutAdapter;
  let shipment$: Observable<Shipment | null>;
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
          provide: CheckoutShipmentService,
          useClass: DefaultCheckoutShipmentService,
        },
      ],
    });

    service = testInjector.inject(CheckoutShipmentService);
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
    expect(service).toBeInstanceOf(DefaultCheckoutShipmentService);
  });

  describe('getShipment', () => {
    it('should return an observable', () => {
      expect(service.getShipment()).toBeInstanceOf(Observable);
    });

    it('should get shipments for current cart', () => {
      service.getShipment().subscribe(callback);

      expect(callback).toHaveBeenCalledWith(mockNormalizedShipmentAttributes);
    });

    it('should not return shipments if user id or cart id is missing', () => {
      adapter.get.mockReturnValue(of({}));

      service.getShipment().subscribe(callback);
      expect(callback).toHaveBeenCalledWith(null);
    });
  });

  describe('when calling getCarriers', () => {
    it('should return an observable', () => {
      expect(service.getCarriers()).toBeInstanceOf(Observable);
    });

    it('should get carriers for current cart', () => {
      service.getCarriers().subscribe(callback);

      expect(callback).toHaveBeenCalledWith(mockFilteredShipmentMethods);
    });

    it('should not return carriers if user id or cart id is missing', () => {
      adapter.get.mockReturnValue(of({}));

      service.getCarriers().subscribe(callback);
      expect(callback).toHaveBeenCalledWith([]);
    });
  });

  describe('when calling getSelectedShipmentMethod', () => {
    it('should return an observable', () => {
      expect(service.getSelectedShipmentMethod()).toBeInstanceOf(Observable);
    });

    it('should get selected shipment method id for current cart', () => {
      service.getSelectedShipmentMethod().subscribe(callback);

      expect(callback).toHaveBeenCalledWith(2);
    });

    it('should not return selected shipment method if user id or cart id is missing', () => {
      adapter.get.mockReturnValue(of({}));

      service.getSelectedShipmentMethod().subscribe(callback);
      expect(callback).toHaveBeenCalledWith(0);
    });
  });

  describe('setShipmentMethod', () => {
    it('should return an observable', () => {
      expect(service.setShipmentMethod(1)).toBeInstanceOf(Observable);
    });

    it('should update selected shipment method', () => {
      shipment$ = service.getShipment();

      shipment$.subscribe(shipmentsCallback);
      service.setShipmentMethod(1).subscribe(callback);

      expect(callback).toHaveBeenCalledWith(undefined);
      expect(shipmentsCallback).toHaveBeenCalledWith(
        mockNormalizedUpdatedCheckoutData.shipments[0]
      );
    });
  });
});
