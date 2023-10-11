import { Cart, CartEntry, CartService } from '@spryker-oryx/cart';
import { TokenResourceResolvers } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { CartResolver, CartResourceResolver } from './cart.resolver';

const emptyCart = {};

const smallCart = {
  products: [
    { quantity: 1 } as CartEntry,
    { quantity: 2 } as CartEntry,
    { quantity: 3 } as CartEntry,
  ],
};

const bigCart = {
  products: [
    { quantity: 50 } as CartEntry,
    { quantity: 50 } as CartEntry,
    { quantity: 50 } as CartEntry,
  ],
};

const variousValuesTypeCart = {
  products: [
    { quantity: '50' } as CartEntry,
    { quantity: 50 } as CartEntry,
    { quantity: 50 } as CartEntry,
  ],
};

class MockCartService implements Partial<CartService> {
  getCart = vi.fn().mockReturnValue(of(null));
}

describe('CartResolver', () => {
  let resolver: CartResolver;
  let cartService: MockCartService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: CartService,
          useClass: MockCartService,
        },
        CartResourceResolver,
      ],
    });

    resolver = testInjector.inject(`${TokenResourceResolvers}CART`);
    cartService = testInjector.inject(
      CartService
    ) as unknown as MockCartService;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  describe('SUMMARY', () => {
    const expectedResult = (
      description: string,
      expectation: null | string,
      cart: Partial<Cart> | null = null
    ) => {
      describe(description, () => {
        const callback = vi.fn();
        beforeEach(() => {
          cartService.getCart = vi.fn().mockReturnValue(of(cart));
          resolver.resolve('SUMMARY').subscribe(callback);
        });

        it(`should return ${expectation}`, () => {
          expect(callback).toHaveBeenCalledWith(expectation);
        });
      });
    };

    expectedResult('when cart is not ready', null);
    expectedResult('when cart is empty', null, emptyCart);
    expectedResult('when cart is provided', '6', smallCart);
    expectedResult(
      'when cart`s summary quantity is bigger then 99',
      '99+',
      bigCart
    );
    expectedResult(
      'when cart`s summary quantity is bigger then 99',
      '99+',
      variousValuesTypeCart
    );
  });

  describe('EMPTY', () => {
    const expectedResult = (
      description: string,
      expectation: boolean,
      cart: Partial<Cart>
    ) => {
      describe(description, () => {
        const callback = vi.fn();
        beforeEach(() => {
          cartService.getCart = vi.fn().mockReturnValue(of(cart));
          resolver.resolve('EMPTY').subscribe(callback);
        });

        it(`should return ${expectation}`, () => {
          expect(callback).toHaveBeenCalledWith(expectation);
        });
      });
    };

    expectedResult('when cart is empty', true, emptyCart);
    expectedResult('when cart is not empty', false, smallCart);
  });
});
