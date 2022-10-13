import { Cart, CartController, CartService } from '@spryker-oryx/cart';
import { mockBaseCart } from '@spryker-oryx/cart/mocks';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import * as litRxjs from '@spryker-oryx/lit-rxjs';
import { PricingService } from '@spryker-oryx/site';
import { LitElement } from 'lit';
import { of, take } from 'rxjs';
import { SpyInstance } from 'vitest';

const mockThis = {} as LitElement;

const mockObserve = {
  get: vi.fn().mockReturnValue(of(null)),
};

class MockPricingService {
  format = vi.fn();
}

class MockCartService implements Partial<CartService> {
  getCart = vi.fn();
  getTotals = vi.fn();
}

vi.spyOn(litRxjs, 'ObserveController') as SpyInstance;
(litRxjs.ObserveController as unknown as SpyInstance).mockReturnValue(
  mockObserve
);

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
        new CartController(mockThis)
          .getTotalQuantity()
          .subscribe((val) => expect(val).toBeNull());
      });
    });

    describe('when there is a cart without products', () => {
      beforeEach(async () => {
        service.getCart.mockReturnValue(of({}));
      });
      it('should return null', () => {
        new CartController(mockThis)
          .getTotalQuantity()
          .subscribe((val) => expect(val).toBeNull());
      });
    });

    describe('when there are no products in the cart', () => {
      beforeEach(async () => {
        service.getCart.mockReturnValue(of({ products: [] }));
      });
      it('should return 0', () => {
        new CartController(mockThis)
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
        new CartController(mockThis)
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
        service.getTotals.mockReturnValue(of(mockBaseCart.totals));
      });
      it('should format the priceToPay', () => {
        new CartController(mockThis)
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
        new CartController(mockThis)
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
        service.getTotals.mockReturnValue(of(mockBaseCart.totals));
        pricingService.format.mockReturnValue(of(mockFormattedPrice));
      });

      it('should format the discounted amount', () => {
        new CartController(mockThis)
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
      service.getTotals.mockReturnValue(of(mockBaseCart.totals));
      pricingService.format.mockReturnValue(of('whatever'));

      new CartController(mockThis).getTotals().subscribe(() => {
        expect(pricingService.format).toHaveBeenCalledTimes(1);
        expect(pricingService.format).toHaveBeenCalledWith(-100);
      });
    });
  });
});
