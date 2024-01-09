import { Cart, CartController, CartService } from '@spryker-oryx/cart';
import { mockBaseCart } from '@spryker-oryx/cart/mocks';
import * as core from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { PricingService } from '@spryker-oryx/site';
import * as litRxjs from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { of, take } from 'rxjs';
import { SpyInstance } from 'vitest';

const mockContext = {
  get: vi.fn().mockReturnValue(of('MOCK')),
};

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

vi.spyOn(core, 'ContextController') as SpyInstance;
(core.ContextController as unknown as SpyInstance).mockReturnValue(mockContext);

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

  const setupMockedData = (data: Cart | null): void => {
    service.getCart.mockReturnValue(of(data));
    service.getTotals.mockReturnValue(of(mockBaseCart.totals));
  };

  describe('getTotalItemsQuantity(', () => {
    describe('when there is no cart', () => {
      beforeEach(() => {
        setupMockedData(null);
      });
      it('should return null', () => {
        new CartController(mockThis)
          .getTotalQuantity()
          .subscribe((val) => expect(val).toBeNull());
      });
    });

    describe('when there is a cart without products', () => {
      beforeEach(async () => {
        setupMockedData({} as Cart);
      });
      it('should return null', () => {
        new CartController(mockThis)
          .getTotalQuantity()
          .subscribe((val) => expect(val).toBeNull());
      });
    });

    describe('when there are no products in the cart', () => {
      beforeEach(async () => {
        setupMockedData({ products: [] } as unknown as Cart);
      });
      it('should return 0', () => {
        new CartController(mockThis)
          .getTotalQuantity()
          .subscribe((val) => expect(val).toBe(0));
      });
    });

    describe('when there are multiple products', () => {
      beforeEach(async () => {
        setupMockedData({
          products: [
            { quantity: 2 },
            { quantity: 5 },
            { quantity: 3 },
            { quantity: 1 },
          ],
        } as unknown as Cart);
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

    describe('when there are no products in the cart', () => {
      beforeEach(() => {
        setupMockedData({ totals: { expenseTotal: 0, taxTotal: 0 } } as Cart);
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

    describe('priceToPay', () => {
      describe('when a priceToPay is provided', () => {
        beforeEach(() => {
          setupMockedData({
            totals: { priceToPay: 5 },
            products: [{ sku: '123', quantity: 1 }],
          } as Cart);
        });
        it('should format the priceToPay amount', () => {
          new CartController(mockThis)
            .getTotals()
            .pipe(take(1))
            .subscribe((totals) => {
              expect(pricingService.format).toHaveBeenCalledWith(5);
              expect(totals?.calculations.priceToPay).toBe(mockFormattedPrice);
            });
        });
      });
    });

    describe('subtotal', () => {
      describe('when a subtotal is provided', () => {
        beforeEach(() => {
          setupMockedData({
            totals: { subtotal: 5 },
            products: [{ sku: '123', quantity: 1 }],
          } as Cart);
        });

        it('should format the subtotal amount', () => {
          new CartController(mockThis)
            .getTotals()
            .pipe(take(1))
            .subscribe((totals) => {
              expect(pricingService.format).toHaveBeenCalledWith(5);
              expect(totals?.calculations.subtotal).toBe(mockFormattedPrice);
            });
        });
      });

      describe('when the subtotal is 0', () => {
        beforeEach(() => {
          setupMockedData({
            totals: { taxTotal: 0 },
            products: [{ sku: '123', quantity: 1 }],
          } as Cart);
        });

        it('should not populate the subtotal amount', () => {
          new CartController(mockThis)
            .getTotals()
            .pipe(take(1))
            .subscribe((totals) => {
              expect(pricingService.format).not.toHaveBeenCalled();
              expect(totals?.calculations.subtotal).toBeUndefined();
            });
        });
      });
    });

    describe('discounts', () => {
      describe('when there are discounts', () => {
        beforeEach(() => {
          setupMockedData({
            totals: { priceToPay: 5 },
            products: [{ sku: '123', quantity: 1 }],
            discounts: [{ amount: 5, code: 'bar' }],
          } as Cart);
        });

        it('should format the discount amount', () => {
          new CartController(mockThis)
            .getTotals()
            .pipe(take(1))
            .subscribe((totals) => {
              expect(pricingService.format).toHaveBeenCalledWith(-5);
              expect(totals?.discounts?.[0].amount).toBe(mockFormattedPrice);
            });
        });

        it('should return negative price for discount', () => {
          setupMockedData({
            totals: { discountTotal: 100 },
            products: [{ quantity: 1 }],
          } as Cart);

          new CartController(mockThis).getTotals().subscribe(() => {
            expect(pricingService.format).toHaveBeenCalledTimes(1);
            expect(pricingService.format).toHaveBeenCalledWith(-100);
          });
        });
      });

      describe('when there are no discounts', () => {
        beforeEach(() => {
          setupMockedData({
            totals: {},
            products: [{ sku: '123', quantity: 1 }],
          } as Cart);
        });

        it('should not populate discounts', () => {
          new CartController(mockThis)
            .getTotals()
            .pipe(take(1))
            .subscribe((totals) => {
              expect(pricingService.format).not.toHaveBeenCalled();
              expect(totals?.discounts?.length).toBe(0);
            });
        });
      });

      describe('when the discount is 0', () => {
        beforeEach(() => {
          setupMockedData({
            totals: { discountTotal: 0 },
            products: [{ sku: '123', quantity: 1 }],
          } as Cart);
        });

        it('should not populate discounts', () => {
          new CartController(mockThis)
            .getTotals()
            .pipe(take(1))
            .subscribe((totals) => {
              expect(pricingService.format).not.toHaveBeenCalled();
              expect(totals?.discounts?.length).toBe(0);
            });
        });
      });
    });

    describe('expense', () => {
      describe('when an expense is provided', () => {
        beforeEach(() => {
          setupMockedData({
            totals: { expenseTotal: 5 },
            products: [{ sku: '123', quantity: 1 }],
          } as Cart);
        });

        it('should format the expense amount', () => {
          new CartController(mockThis)
            .getTotals()
            .pipe(take(1))
            .subscribe((totals) => {
              expect(pricingService.format).toHaveBeenCalledWith(5);
              expect(totals?.calculations.expenseTotal).toBe(
                mockFormattedPrice
              );
            });
        });
      });

      describe('when the expense is 0', () => {
        beforeEach(() => {
          setupMockedData({
            totals: { expenseTotal: 0 },
            products: [{ sku: '123', quantity: 1 }],
          } as Cart);
        });

        it('should not populate the expense', () => {
          new CartController(mockThis)
            .getTotals()
            .pipe(take(1))
            .subscribe((totals) => {
              expect(pricingService.format).not.toHaveBeenCalled();
              expect(totals?.calculations.expenseTotal).toBeUndefined();
            });
        });
      });
    });

    describe('tax', () => {
      describe('when an tax is provided', () => {
        beforeEach(() => {
          setupMockedData({
            totals: { taxTotal: 5 },
            products: [{ sku: '123', quantity: 1 }],
          } as Cart);
        });

        it('should format the tax amount', () => {
          new CartController(mockThis)
            .getTotals()
            .pipe(take(1))
            .subscribe((totals) => {
              expect(pricingService.format).toHaveBeenCalledWith(5);
              expect(totals?.calculations.taxTotal).toBe(mockFormattedPrice);
            });
        });
      });

      describe('when the tax is 0', () => {
        beforeEach(() => {
          setupMockedData({
            totals: { taxTotal: 0 },
            products: [{ sku: '123', quantity: 1 }],
          } as Cart);
        });

        it('should not populate the tax', () => {
          new CartController(mockThis)
            .getTotals()
            .pipe(take(1))
            .subscribe((totals) => {
              expect(pricingService.format).not.toHaveBeenCalled();
              expect(totals?.calculations.taxTotal).toBeUndefined();
            });
        });
      });
    });
  });

  describe('when observable attribute is provided', () => {
    const cartId = 'mockId';
    beforeEach(() => {
      setupMockedData(null);
      vi.spyOn(litRxjs, 'ObserveController') as SpyInstance;
      (litRxjs.ObserveController as unknown as SpyInstance).mockReturnValue({
        get: vi.fn().mockReturnValue(of(cartId)),
      });
    });

    it('should call service method with proper qualifier', () => {
      new CartController(mockThis)
        .getCart()
        .pipe(take(1))
        .subscribe(() => {
          expect(service.getCart).toHaveBeenCalledWith({ cartId });
        });
    });
  });
});
