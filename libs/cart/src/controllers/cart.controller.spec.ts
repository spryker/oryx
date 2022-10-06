import { Cart, CartController, CartService } from '@spryker-oryx/cart';
import { mockCartTotals } from '@spryker-oryx/cart/mocks';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { PricingService } from '@spryker-oryx/site';
import { of, take } from 'rxjs';

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

  describe('getTotalItemsQuantity(', () => {
    describe('when there is no cart', () => {
      beforeEach(async () => {
        service.getCart.mockReturnValue(of(null));
      });
      it('should return null', () => {
        new CartController()
          .getTotalQuantity()
          .subscribe((val) => expect(val).toBeNull());
      });
    });

    describe('when there is a cart without products', () => {
      beforeEach(async () => {
        service.getCart.mockReturnValue(of({}));
      });
      it('should return null', () => {
        new CartController()
          .getTotalQuantity()
          .subscribe((val) => expect(val).toBeNull());
      });
    });

    describe('when there are no products in the cart', () => {
      beforeEach(async () => {
        service.getCart.mockReturnValue(of({ products: [] }));
      });
      it('should return 0', () => {
        new CartController()
          .getTotalQuantity()
          .subscribe((val) => expect(val).toBe(0));
      });
    });

    describe('when there are multiple products', () => {
      beforeEach(async () => {
        service.getCart.mockReturnValue(
          of({
            products: [
              { quantity: 2 },
              { quantity: 5 },
              { quantity: 3 },
              { quantity: 1 },
            ],
          })
        );
      });
      it('should cumulate the quantities', () => {
        new CartController()
          .getTotalQuantity()
          .subscribe((val) => expect(val).toBe(11));
      });
    });
  });

  describe('getTotals()', () => {
    const mockFormattedPrice = 'formatted price';
    beforeEach(() => {
      pricingService.format.mockReturnValue(of(mockFormattedPrice));
    });

    describe('when there is a valid cart', () => {
      beforeEach(() => {
        service.getCart.mockReturnValue(
          of({
            totals: { priceToPay: 5 },
            products: [{ sku: '123', quantity: 1 }],
          } as Cart)
        );
        service.getTotals.mockReturnValue(of(mockCartTotals));
      });
      it('should format the priceToPay', () => {
        new CartController()
          .getTotals()
          .pipe(take(1))
          .subscribe((totals) => {
            expect(totals?.calculations.priceToPay).toBe(mockFormattedPrice);
          });
      });
    });

    describe('when there are no products in the cart', () => {
      beforeEach(() => {
        service.getCart.mockReturnValue(of({} as Cart));
        service.getTotals.mockReturnValue(of({ expenseTotal: 0, taxTotal: 0 }));
      });
      it('should return null', () => {
        new CartController()
          .getTotals()
          .pipe(take(1))
          .subscribe((totals) => {
            expect(totals).toBeNull();
          });
      });
    });

    describe('when there are discounts', () => {
      beforeEach(() => {
        service.getCart.mockReturnValue(
          of({
            totals: { priceToPay: 5 },
            products: [{ sku: '123', quantity: 1 }],
            discounts: [{ amount: 5, code: 'bar' }],
          } as Cart)
        );
        service.getTotals.mockReturnValue(of(mockCartTotals));
        pricingService.format.mockReturnValue(of(mockFormattedPrice));
      });

      it('should format the discounted amount', () => {
        new CartController()
          .getTotals()
          .pipe(take(1))
          .subscribe((totals) => {
            expect(pricingService.format).toHaveBeenCalledWith(-5);
            expect(totals?.discounts?.[0].amount).toBe(mockFormattedPrice);
          });
      });
    });

    it('should return negative price for discount', () => {
      service.getCart.mockReturnValue(
        of({
          totals: { discountTotal: 100 },
          products: [{ quantity: 1 }],
        } as Cart)
      );
      service.getTotals.mockReturnValue(of(mockCartTotals));
      pricingService.format.mockReturnValue(of('whatever'));

      new CartController().getTotals().subscribe(() => {
        expect(pricingService.format).toHaveBeenCalledTimes(1);
        expect(pricingService.format).toHaveBeenCalledWith(-100);
      });
    });
  });
});
