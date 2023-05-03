import { CartService } from '@spryker-oryx/cart';
import {
  mockFilteredShipmentMethods,
  mockNormalizedCheckoutData,
  mockNormalizedUpdatedCheckoutData,
} from '@spryker-oryx/checkout/mocks';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { Observable, of } from 'rxjs';
import { CheckoutAdapter } from '../adapter';
import { CheckoutShipmentService } from './checkout-shipment.service';
import { DefaultCheckoutShipmentService } from './default-checkout-shipment.service';

const mockCartId = 'mockcartid';

class MockCartService implements Partial<CartService> {
  getCart = vi.fn().mockReturnValue(of({ id: mockCartId }));
}

class MockCheckoutAdapter implements Partial<CheckoutAdapter> {
  get = vi.fn().mockReturnValue(of(mockNormalizedCheckoutData));
  update = vi.fn().mockReturnValue(of(mockNormalizedUpdatedCheckoutData));
}

describe('DefaultCheckoutService', () => {
  let service: CheckoutShipmentService;
  let cart: MockCartService;
  let adapter: MockCheckoutAdapter;
  // let shipment$: Observable<Shipment | null>;
  const callback = vi.fn();
  // const shipmentsCallback = vi.fn();
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
    cart = testInjector.inject<MockCartService>(CartService);
    adapter = testInjector.inject<MockCheckoutAdapter>(CheckoutAdapter);
    cart.getCart.mockReturnValue(of({ id: mockCartId }));
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultCheckoutShipmentService);
  });

  // describe('getShipment', () => {
  //   it('should return an observable', () => {
  //     expect(service.getShipment()).toBeInstanceOf(Observable);
  //   });

  //   it('should get shipments for current cart', () => {
  //     service.getShipment().subscribe(callback);

  //     expect(callback).toHaveBeenCalledWith(mockNormalizedShipmentAttributes);
  //   });

  //   it('should not return shipments if user id or cart id is missing', () => {
  //     adapter.get.mockReturnValue(of({}));

  //     service.getShipment().subscribe(callback);
  //     expect(callback).toHaveBeenCalledWith(null);
  //   });
  // });

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

  // describe('when calling getSelected', () => {
  //   it('should return an observable', () => {
  //     expect(service.selected()).toBeInstanceOf(Observable);
  //   });

  //   describe('when shipment method is stored in session storage', () => {
  //     beforeEach(() => {
  //       dataService.getShipment.mockReturnValue(of({ idShipmentMethod: 4 }));
  //     });

  //     it('should return shipment method from storage', () => {
  //       service.selected().subscribe(callback);
  //       expect(callback).toHaveBeenCalledWith(4);
  //     });
  //   });
  // });

  // describe('setShipmentMethod', () => {
  //   it('should return an observable', () => {
  //     expect(service.select(1)).toBeInstanceOf(Observable);
  //   });

  //   it('should call CheckoutDataService setShipmentDetails', () => {
  //     service.select(1).subscribe();

  //     expect(dataService.setShipment).toHaveBeenCalledWith(
  //       expect.objectContaining({ idShipmentMethod: 1 })
  //     );
  //   });
  // });
});
