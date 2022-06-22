import { Injector } from '@spryker-oryx/injector';
import { of } from 'rxjs';
import { CartAdapter, GetCartProps } from './adapter/cart.adapter';
import { CartService } from './cart.service';
import { DefaultCartService } from './default-cart.service';
import { UserService } from './user.service';

class MockCartAdapter implements Partial<CartAdapter> {
  get = vi
    .fn()
    .mockImplementation((qualifier: GetCartProps) =>
      of({ name: `adapter ${qualifier.cartId}` })
    );
}

class MockUserService implements Partial<UserService> {
  get = vi.fn().mockImplementation(() => of('anonymous-user-id'));
}

describe('DefaultCartService', () => {
  let service: CartService;
  let adapter: CartAdapter;
  let testInjector;

  beforeEach(() => {
    testInjector = new Injector([
      {
        provide: CartAdapter,
        useClass: MockCartAdapter,
      },
      {
        provide: CartService,
        useClass: DefaultCartService,
      },
      {
        provide: UserService,
        useClass: MockUserService,
      },
    ]);

    service = testInjector.inject(CartService);
    adapter = testInjector.inject(CartAdapter);
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultCartService);
  });
});
