import { CartQuery, CartService } from '@spryker-oryx/cart';
import {
  CheckoutAdapter,
  CheckoutDataService,
  CheckoutStateService,
} from '@spryker-oryx/checkout';
import {
  DefaultQueryService,
  QueryService,
  provideQuery,
} from '@spryker-oryx/core';
import { Injector, createInjector, destroyInjector } from '@spryker-oryx/di';
import { of, take } from 'rxjs';
import { DefaultCheckoutDataService } from './';

class MockCartService implements Partial<CartService> {
  getCart = vi.fn().mockReturnValue(of());
}

class MockCheckoutAdapter implements Partial<CheckoutAdapter> {
  get = vi.fn();
}

class MockCheckoutStateService implements Partial<CheckoutStateService> {
  getAll = vi.fn().mockReturnValue(of({}));
}

describe('DefaultCheckoutDataService', () => {
  let injector: Injector;
  let checkoutDataService: CheckoutDataService;
  let cartService: MockCartService;
  let adapter: MockCheckoutAdapter;

  beforeEach(() => {
    injector = createInjector({
      providers: [
        { provide: CheckoutDataService, useClass: DefaultCheckoutDataService },
        { provide: CheckoutAdapter, useClass: MockCheckoutAdapter },
        { provide: CartService, useClass: MockCartService },
        { provide: QueryService, useClass: DefaultQueryService },
        provideQuery(CartQuery, () => ({
          loader: () => of({}),
        })),
        { provide: CheckoutStateService, useClass: MockCheckoutStateService },
      ],
    });

    cartService = injector.inject<MockCartService>(CartService);
    adapter = injector.inject<MockCheckoutAdapter>(CheckoutAdapter);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    checkoutDataService = injector.inject(CheckoutDataService);
    expect(checkoutDataService).toBeInstanceOf(DefaultCheckoutDataService);
  });

  describe('when there is no cart available', () => {
    beforeEach(() => {
      cartService.getCart.mockReturnValue(of(null));
      checkoutDataService = injector.inject(CheckoutDataService);
      checkoutDataService.get('paymentMethods').pipe(take(1)).subscribe();
    });

    it('should not load data', () => {
      expect(adapter.get).not.toBeCalled();
    });
  });

  describe('when there is a cart id', () => {
    beforeEach(() => {
      cartService.getCart.mockReturnValue(of({ id: 'foo' }));
      checkoutDataService = injector.inject(CheckoutDataService);
      checkoutDataService.get('paymentMethods').pipe(take(1)).subscribe();
    });

    it('should load data', () => {
      expect(adapter.get).toBeCalled();
    });
  });
});
