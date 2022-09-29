import { CartService, CartTotals } from '@spryker-oryx/cart';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { PricingService } from '@spryker-oryx/site';
import '@spryker-oryx/testing';
import { of, take } from 'rxjs';
import { mockCartTotals } from '../mocks/mock-cart';
import { CartController } from './cart.controller';

class MockPricingService {
  format = vi.fn();
}

class MockCartService implements Partial<CartService> {
  getCart = vi.fn();
  getTotals = vi.fn();
}

describe('Cart controller', () => {
  let service: MockCartService;
  let pricingService: MockPricingService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: CartService,
          useClass: MockCartService,
        },
        {
          provide: PricingService,
          useClass: MockPricingService,
        },
      ],
    });

    service = testInjector.inject(CartService) as unknown as MockCartService;
    pricingService = testInjector.inject(
      PricingService
    ) as unknown as MockPricingService;
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when one product in quantity "1" is in the cart', () => {
    beforeEach(async () => {
      service.getCart.mockReturnValue(of({ products: [{ quantity: 1 }] }));
    });

    it('should return total quantity', () => {
      new CartController()
        .getTotalItemsQuantity()
        .subscribe((val) => expect(val).toBe(1));
    });
  });

  describe('when one product in quantity "2" is in the cart', () => {
    beforeEach(async () => {
      service.getCart.mockReturnValue(of({ products: [{ quantity: 2 }] }));
    });

    it('should return total quantity', () => {
      new CartController()
        .getTotalItemsQuantity()
        .subscribe((val) => expect(val).toBe(2));
    });
  });

  describe('when two products in quantity "1" are in the cart', () => {
    beforeEach(async () => {
      service.getCart.mockReturnValue(
        of({ products: [{ quantity: 1 }, { quantity: 1 }] })
      );
    });

    it('should return total quantity', () => {
      new CartController()
        .getTotalItemsQuantity()
        .subscribe((val) => expect(val).toBe(2));
    });
  });

  describe('when two products in quantity "2" are in the cart', () => {
    beforeEach(async () => {
      service.getCart.mockReturnValue(
        of({ products: [{ quantity: 2 }, { quantity: 2 }] })
      );
    });

    it('should return total quantity', () => {
      new CartController()
        .getTotalItemsQuantity()
        .subscribe((val) => expect(val).toBe(4));
    });
  });

  describe('getTotals', () => {
    it('should return formatted totals values', () => {
      const mockFormattedPrice = 'formatted price';
      service.getCart.mockReturnValue(
        of({ totals: { priceToPay: 5 } as CartTotals })
      );
      service.getTotals.mockReturnValue(of(mockCartTotals));
      pricingService.format.mockReturnValue(of(mockFormattedPrice));

      new CartController()
        .getTotals()
        .pipe(take(1))
        .subscribe((totals) => {
          expect(totals?.calculations.priceToPay).toBe(mockFormattedPrice);
        });
    });

    it('should not return formatted totals with 0 value', () => {
      service.getCart.mockReturnValue(of({ products: [{ quantity: 0 }] }));
      service.getTotals.mockReturnValue(
        of({
          expenseTotal: 0,
          taxTotal: 0,
        })
      );

      new CartController()
        .getTotals()
        .pipe(take(1))
        .subscribe((totals) => {
          expect(totals?.calculations).toEqual({});
        });
    });

    it('should return null if cart does not exist', () => {
      service.getCart.mockReturnValue(of(null));
      service.getTotals.mockReturnValue(of(null));

      new CartController()
        .getTotals()
        .pipe(take(1))
        .subscribe((totals) => {
          expect(totals).toBe(null);
        });
    });

    it('should return negative price for discount', () => {
      service.getCart.mockReturnValue(
        of({ totals: { discountTotal: 100 } as CartTotals })
      );
      service.getTotals.mockReturnValue(of(mockCartTotals));
      pricingService.format.mockReturnValue(of('whatever'));

      new CartController().getTotals().subscribe();

      expect(pricingService.format).toHaveBeenCalledTimes(1);
      expect(pricingService.format).toHaveBeenCalledWith(-100);
    });
  });
});
