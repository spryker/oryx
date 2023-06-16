import { Cart, CartService } from '@spryker-oryx/cart';
import {
  CheckoutDataService,
  CheckoutResponse,
  CheckoutService,
  CheckoutState,
  CheckoutStateService,
  DefaultCheckoutService,
} from '@spryker-oryx/checkout';
import { QueryService } from '@spryker-oryx/core';
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
  clear = vi.fn();
}

class MockQueryService implements Partial<QueryService> {
  emit = vi.fn();
}

const mockCart = new BehaviorSubject<Cart | null>(null);

describe('DefaultCheckoutService', () => {
  let checkoutService: CheckoutService;
  let checkoutStateService: MockCheckoutStateService;
  let cartService: MockCartService;
  let orderService: MockOrderService;
  let adapter: MockCheckoutAdapter;
  let linkService: MockSemanticLinkService;

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
        { provide: QueryService, useClass: MockQueryService },
      ],
    });

    adapter = injector.inject<MockCheckoutAdapter>(CheckoutAdapter);
    cartService = injector.inject<MockCartService>(CartService);
    orderService = injector.inject<MockOrderService>(OrderService);
    cartService.getCart.mockReturnValue(mockCart);
    checkoutService = injector.inject(CheckoutService);
    checkoutStateService =
      injector.inject<MockCheckoutStateService>(CheckoutStateService);
    linkService = injector.inject<MockSemanticLinkService>(SemanticLinkService);
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
        adapter.placeOrder.mockReturnValue(
          of({ orders: [{}] } as CheckoutResponse)
        );
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

      it('should clear the state', () => {
        expect(checkoutStateService.clear).toBeCalled();
      });

      it('should reload the cart', () => {
        expect(cartService.reload).toBeCalled();
      });

      it('should store the order', () => {
        expect(orderService.storeLastOrder).toBeCalled();
      });
    });

    describe('and a redirectUrl is returned', () => {
      beforeEach(() => {
        checkoutStateService.getAll.mockReturnValue(of({}));
        adapter.placeOrder.mockReturnValue(
          of({ redirectUrl: 'https://redirect.com' })
        );
        checkoutService.placeOrder();
      });

      it('should not add a redirect', () => {
        expect(linkService.get).not.toHaveBeenCalled();
      });
    });

    describe('and a redirectUrl is not returned', () => {
      let redirect: any;

      beforeEach(() => {
        linkService.get.mockReturnValue(of('https://redirect.com'));
        checkoutStateService.getAll.mockReturnValue(of({}));
        adapter.placeOrder.mockReturnValue(of({}));
        checkoutService
          .placeOrder()
          .subscribe((response) => (redirect = response.redirectUrl));
      });

      it('should add a redirect', () => {
        expect(linkService.get).toHaveBeenCalled();
      });

      it('should store the redirect in the response', () => {
        expect(redirect).toBe('https://redirect.com');
      });
    });
  });
});
