import { IdentityService } from '@spryker-oryx/auth';
import { Cart, CartService } from '@spryker-oryx/cart';
import {
  CheckoutDataService,
  CheckoutResponse,
  CheckoutService,
  CheckoutStateService,
  CheckoutStatus,
  DefaultCheckoutService,
} from '@spryker-oryx/checkout';
import { DefaultQueryService, QueryService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { OrderService } from '@spryker-oryx/order';
import { LinkService } from '@spryker-oryx/site';
import { BehaviorSubject, of, take } from 'rxjs';
import { CheckoutAdapter } from './adapter';

class MockIdentityService implements Partial<IdentityService> {
  get = vi.fn().mockReturnValue(of({ userId: 'anon-user-id' }));
}

class MockCartService implements Partial<CartService> {
  getCart = vi.fn();
  reload = vi.fn();
}

class MockCheckoutAdapter implements Partial<CheckoutAdapter> {
  placeOrder = vi.fn();
}
class MockSemanticLinkService implements Partial<LinkService> {
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
        { provide: LinkService, useClass: MockSemanticLinkService },
        { provide: CheckoutService, useClass: DefaultCheckoutService },
        { provide: OrderService, useClass: MockOrderService },
        { provide: CheckoutDataService, useClass: MockCheckoutDataService },
        { provide: CheckoutStateService, useClass: MockCheckoutStateService },
        { provide: QueryService, useClass: DefaultQueryService },
        { provide: IdentityService, useClass: MockIdentityService },
      ],
    });

    adapter = injector.inject<MockCheckoutAdapter>(CheckoutAdapter);
    cartService = injector.inject<MockCartService>(CartService);
    orderService = injector.inject<MockOrderService>(OrderService);
    cartService.getCart.mockReturnValue(mockCart);
    checkoutService = injector.inject(CheckoutService);
    checkoutStateService =
      injector.inject<MockCheckoutStateService>(CheckoutStateService);
    linkService = injector.inject<MockSemanticLinkService>(LinkService);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(checkoutService).toBeInstanceOf(DefaultCheckoutService);
  });

  describe('when the cart is empty', () => {
    let result: CheckoutStatus;

    beforeEach(async () => {
      mockCart.next(null);
      checkoutService
        .getStatus()
        .pipe(take(1))
        .subscribe((state) => (result = state));
    });

    it('should return an empty state', () => {
      expect(result).toBe(CheckoutStatus.Empty);
    });
  });

  describe('when a cart id is available', () => {
    let result: CheckoutStatus;

    beforeEach(async () => {
      mockCart.next({ id: 'foo' } as Cart);
      checkoutService
        .getStatus()
        .pipe(take(1))
        .subscribe((state) => (result = state));
    });

    it('should return an read state', () => {
      expect(result).toBe(CheckoutStatus.Ready);
    });
  });

  describe('when placeOrder is called', () => {
    describe('and no valid state is provided', () => {
      const result: CheckoutStatus[] = [];

      beforeEach(() => {
        checkoutStateService.getAll.mockReturnValue(of(null));
        checkoutService
          .getStatus()
          .pipe(take(3))
          .subscribe((state) => result.push(state));
        checkoutService.placeOrder();
      });

      it('should change the state to Ready', () => {
        expect(result).toEqual([
          CheckoutStatus.Ready,
          CheckoutStatus.Busy,
          CheckoutStatus.Ready,
        ]);
      });

      it('should call the adapter to place the order', () => {
        expect(adapter.placeOrder).not.toHaveBeenCalled();
      });
    });

    describe('and a valid state object is returned', () => {
      const result: CheckoutStatus[] = [];
      const state = { foo: 'bar' };

      beforeEach(() => {
        checkoutStateService.getAll.mockReturnValue(of(state));
        adapter.placeOrder.mockReturnValue(
          of({ orders: [{}] } as CheckoutResponse)
        );
        checkoutService
          .getStatus()
          .pipe(take(3))
          .subscribe((state) => result.push(state));
        checkoutService.placeOrder();
      });

      it('should change the state to Ready', () => {
        expect(result).toEqual([
          CheckoutStatus.Ready,
          CheckoutStatus.Busy,
          CheckoutStatus.Ready,
        ]);
      });

      it('should call the adapter to place the order', () => {
        expect(adapter.placeOrder).toHaveBeenCalledWith({
          ...state,
          cartId: 'foo',
        });
      });

      it('should clear the state', () => {
        expect(checkoutStateService.clear).toBeCalled();
      });

      it('should store the order', () => {
        expect(orderService.storeLastOrder).toBeCalledWith({}, 'anon-user-id');
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
