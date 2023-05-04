import { CartService } from '@spryker-oryx/cart';
import {
  CheckoutService,
  DefaultCheckoutService,
} from '@spryker-oryx/checkout';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { OrderService } from '@spryker-oryx/order';
import { SemanticLinkService } from '@spryker-oryx/site';
import { of } from 'rxjs';
import { CheckoutAdapter } from './adapter';

class MockCartService implements Partial<CartService> {}
class MockCheckoutAdapter implements Partial<CheckoutAdapter> {
  placeOrder = vi.fn();
}
class MockSemanticLinkService implements Partial<SemanticLinkService> {
  get = vi.fn().mockReturnValue(of('/link'));
}

class MockOrderService implements Partial<OrderService> {
  storeLastOrder = vi.fn();
}

describe('DefaultCheckoutService', () => {
  let service: CheckoutService;
  let adapter: MockCheckoutAdapter;

  beforeEach(() => {
    const injector = createInjector({
      providers: [
        { provide: CheckoutAdapter, useClass: MockCheckoutAdapter },
        { provide: CartService, useClass: MockCartService },
        { provide: SemanticLinkService, useClass: MockSemanticLinkService },
        { provide: CheckoutService, useClass: DefaultCheckoutService },
        { provide: OrderService, useClass: MockOrderService },
      ],
    });

    adapter = injector.inject<MockCheckoutAdapter>(CheckoutAdapter);
    service = injector.inject(CheckoutService);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultCheckoutService);
  });

  describe('when multiple steps are registered', () => {
    const foo = vi.fn();
    const bar = vi.fn();

    beforeEach(() => {
      adapter.placeOrder.mockReturnValue(of({ response: 'mock' }));
      service.register('foo', foo);
      service.register('bar', bar);
    });

    describe('and the first step does not provide valid data', () => {
      beforeEach(() => {
        foo.mockReturnValue(of(null));
        bar.mockReturnValue(of({ foo: 'bar' }));
        service.placeOrder();
      });

      it('should only call the first callback', () => {
        expect(foo).toHaveBeenCalled();
        expect(bar).not.toHaveBeenCalled();
      });
    });

    describe('and the only the first step provides valid data', () => {
      let result: unknown;
      beforeEach(() => {
        foo.mockReturnValue(of({ foo: 'bar' }));
        bar.mockReturnValue(of(null));
        service.placeOrder().subscribe((r) => (result = r));
      });

      it('should call both callback', () => {
        expect(foo).toHaveBeenCalled();
        expect(bar).toHaveBeenCalled();
      });

      it('should not emit a response', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('and both steps provide valid data', () => {
      let result: unknown;
      beforeEach(() => {
        foo.mockReturnValue(of({ customer: { email: 'foo@bar.com' } }));
        bar.mockReturnValue(of({ bar: 'foo' }));
        service.placeOrder(); //.subscribe((r) => (result = r));
      });

      it('should call both callback', () => {
        expect(foo).toHaveBeenCalled();
        expect(bar).toHaveBeenCalled();
      });

      // it('should not emit a response', () => {
      // console.log('result', result);
      //   expect(result).not.toBeUndefined();
      // });
    });
  });
});
