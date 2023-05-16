import { Cart, CartService } from '@spryker-oryx/cart';
import {
  CheckoutDataService,
  CheckoutService,
  CheckoutState,
  CheckoutStateService,
  DefaultCheckoutService,
} from '@spryker-oryx/checkout';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { OrderService } from '@spryker-oryx/order';
import { SemanticLinkService } from '@spryker-oryx/site';
import { BehaviorSubject, of, take } from 'rxjs';
import { CheckoutAdapter } from './adapter';

class MockCartService implements Partial<CartService> {
  getCart = vi.fn();
  reload = vi.fn();
}

class MockCheckoutAdapter implements Partial<CheckoutAdapter> {
  placeOrder = vi.fn();
}
class MockSemanticLinkService implements Partial<SemanticLinkService> {
  get = vi.fn().mockReturnValue(of('/link'));
}

class MockOrderService implements Partial<OrderService> {
  storeLastOrder = vi.fn();
}

export class MockCheckoutDataService implements Partial<CheckoutDataService> {
  get = vi.fn();
}

export class MockCheckoutStateService implements Partial<CheckoutStateService> {
  getAll = vi.fn();
  get = vi.fn();
  set = vi.fn();
}

const mockCart = new BehaviorSubject<Cart | null>(null);

describe('DefaultCheckoutService', () => {
  let checkoutService: CheckoutService;
  let checkoutStateService: MockCheckoutStateService;
  let cartService: MockCartService;
  let adapter: MockCheckoutAdapter;

  beforeEach(() => {
    const injector = createInjector({
      providers: [
        { provide: CheckoutAdapter, useClass: MockCheckoutAdapter },
        { provide: CartService, useClass: MockCartService },
        { provide: SemanticLinkService, useClass: MockSemanticLinkService },
        { provide: CheckoutService, useClass: DefaultCheckoutService },
        { provide: OrderService, useClass: MockOrderService },
        { provide: CheckoutDataService, useClass: MockCheckoutDataService },
        { provide: CheckoutStateService, useClass: MockCheckoutStateService },
      ],
    });

    adapter = injector.inject<MockCheckoutAdapter>(CheckoutAdapter);
    cartService = injector.inject<MockCartService>(CartService);
    cartService.getCart.mockReturnValue(mockCart);
    checkoutService = injector.inject(CheckoutService);
    checkoutStateService =
      injector.inject<MockCheckoutStateService>(CheckoutStateService);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(checkoutService).toBeInstanceOf(DefaultCheckoutService);
  });

  describe('when the cart is empty', () => {
    let result: CheckoutState;

    beforeEach(async () => {
      mockCart.next(null);
      checkoutService
        .getProcessState()
        .pipe(take(1))
        .subscribe((state) => (result = state));
    });

    it('should return an empty state', () => {
      expect(result).toBe(CheckoutState.Empty);
    });

    it('should invalidate the cart Id on state service', () => {
      expect(checkoutStateService.set).toHaveBeenCalledWith('cartId', {
        valid: false,
        value: null,
      });
    });
  });

  describe('when a cart id is available', () => {
    let result: CheckoutState;

    beforeEach(async () => {
      mockCart.next({ id: 'foo' } as Cart);
      checkoutService
        .getProcessState()
        .pipe(take(1))
        .subscribe((state) => (result = state));
    });

    it('should return an empty state', () => {
      expect(result).toBe(CheckoutState.Ready);
    });

    it('should invalidate the cart Id on state service', () => {
      expect(checkoutStateService.set).toHaveBeenCalledWith('cartId', {
        valid: true,
        value: 'foo',
      });
    });
  });

  describe('when placeOrder is called', () => {
    describe('and no valid state is provided', () => {
      const result: CheckoutState[] = [];

      beforeEach(() => {
        checkoutStateService.getAll.mockReturnValue(of(null));
        checkoutService
          .getProcessState()
          .pipe(take(3))
          .subscribe((state) => result.push(state));
        checkoutService.placeOrder();
      });

      it('should change the state to invalid', () => {
        expect(result).toEqual([
          CheckoutState.Ready,
          CheckoutState.Busy,
          CheckoutState.Invalid,
        ]);
      });

      it('should call the adapter to place the order', () => {
        expect(adapter.placeOrder).not.toHaveBeenCalled();
      });
    });

    describe('and a valid state object is returned', () => {
      const result: CheckoutState[] = [];

      const state = { foo: 'bar' };
      beforeEach(() => {
        checkoutStateService.getAll.mockReturnValue(of(state));
        adapter.placeOrder.mockReturnValue(of({}));
        checkoutService
          .getProcessState()
          .pipe(take(3))
          .subscribe((state) => result.push(state));
        checkoutService.placeOrder();
      });

      it('should change the state to Ready', () => {
        expect(result).toEqual([
          CheckoutState.Ready,
          CheckoutState.Busy,
          CheckoutState.Ready,
        ]);
      });

      it('should call the adapter to place the order', () => {
        expect(adapter.placeOrder).toHaveBeenCalledWith({ attributes: state });
      });
    });
  });
});
