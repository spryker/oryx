import { CartService, TotalsResolver } from '@spryker-oryx/cart';
import { mockBaseCart } from '@spryker-oryx/cart/mocks';
import { ContextService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { CartTotalsResolver } from './cart-totals.resolver';

class MockCartService implements Partial<CartService> {
  getCart = vi.fn().mockReturnValue(of(mockBaseCart));
}

class MockContextService implements Partial<ContextService> {
  get = vi.fn().mockReturnValue(of(undefined));
}

const qualifier = { cartId: 'mock' };

describe('CartTotalsResolver', () => {
  let resolver: CartTotalsResolver;
  let cartService: MockCartService;
  let contextService: MockContextService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: CartService,
          useClass: MockCartService,
        },
        {
          provide: ContextService,
          useClass: MockContextService,
        },
        {
          provide: `${TotalsResolver}CART`,
          useClass: CartTotalsResolver,
        },
      ],
    });

    resolver = testInjector.inject(`${TotalsResolver}CART`);
    cartService = testInjector.inject<MockCartService>(CartService);
    contextService = testInjector.inject<MockContextService>(ContextService);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
    mockFeatureVersion('1.0');
  });

  describe('when totals are resolved', () => {
    const callback = vi.fn();

    beforeEach(() => {
      resolver.getTotals().subscribe(callback);
    });

    it(`should return normalized totals`, () => {
      expect(callback).toHaveBeenCalledWith({
        ...mockBaseCart.totals,
        priceMode: mockBaseCart.priceMode,
        currency: mockBaseCart.currency,
        discounts: mockBaseCart.discounts,
      });
    });
  });

  describe('when cart does not contain products', () => {
    const callback = vi.fn();

    beforeEach(() => {
      cartService.getCart = vi.fn().mockReturnValue(
        of({
          ...mockBaseCart,
          products: [],
        })
      );
      resolver.getTotals().subscribe(callback);
    });

    it(`should return null`, () => {
      expect(callback).toHaveBeenCalledWith(null);
    });
  });

  describe('when feature version >= 1.4', () => {
    beforeEach(() => {
      mockFeatureVersion('1.4');
    });

    describe('and context element is provided', () => {
      beforeEach(() => {
        contextService.get = vi.fn().mockReturnValue(of(qualifier));
      });

      it(`should pass context qualifier to the service`, () => {
        resolver.getTotals({ element: {} as HTMLElement }).subscribe(() => {
          expect(cartService.getCart).toHaveBeenCalledWith(qualifier);
        });
      });
    });
  });
});
