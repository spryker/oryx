import { Cart, CartEntry, CartService } from '@spryker-oryx/cart';
import { ContextService, TokenResourceResolvers } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { CartResolver } from './cart.resolver';

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

class MockContextService implements Partial<ContextService> {
  get = vi.fn().mockReturnValue(of(undefined));
}

const qualifier = { cartId: 'mock' };

describe('CartResolver', () => {
  let resolver: CartResolver;
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
          provide: `${TokenResourceResolvers}CART`,
          useClass: CartResolver,
        },
      ],
    });

    resolver = testInjector.inject(`${TokenResourceResolvers}CART`);
    cartService = testInjector.inject<MockCartService>(CartService);
    contextService = testInjector.inject<MockContextService>(ContextService);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
    mockFeatureVersion('1.0');
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

    describe('when feature version >= 1.4', () => {
      beforeEach(() => {
        mockFeatureVersion('1.4');
      });

      describe('and context provided', () => {
        beforeEach(() => {
          contextService.get = vi.fn().mockReturnValue(of(qualifier));
        });

        it(`should pass context qualifier to the service`, () => {
          resolver
            .resolve('EMPTY', { contextElement: {} as HTMLElement })
            .subscribe(() => {
              expect(cartService.getCart).toHaveBeenCalledWith(qualifier);
            });
        });
      });
    });
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

    describe('when feature version >= 1.4', () => {
      beforeEach(() => {
        mockFeatureVersion('1.4');
      });

      describe('and contextElement is provided', () => {
        beforeEach(() => {
          contextService.get = vi.fn().mockReturnValue(of(qualifier));
        });

        it(`should pass context qualifier to the service`, () => {
          resolver
            .resolve('EMPTY', { contextElement: {} as HTMLElement })
            .subscribe(() => {
              expect(cartService.getCart).toHaveBeenCalledWith(qualifier);
            });
        });
      });
    });
  });
});
