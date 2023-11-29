import { AuthIdentity, AuthService, IdentityService } from '@spryker-oryx/auth';
import { CartAdapter, CartService } from '@spryker-oryx/cart';
import {
  mockBaseCart,
  mockCartEntry,
  mockDefaultCart,
  mockEmptyCart,
} from '@spryker-oryx/cart/mocks';
import { DefaultQueryService, QueryService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  BehaviorSubject,
  Observable,
  of,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { DefaultCartService } from './default-cart.service';

const mockErrorMessage = 'Test Error Message';

const mockUser: AuthIdentity = {
  userId: 'userId',
  isAuthenticated: true,
};

const mockEntryQualifier = {
  sku: 'sku',
  quantity: 1,
};

const mockUpdateEntryQualifier = {
  ...mockEntryQualifier,
  groupKey: 'groupKey',
  quantity: 10,
};

class MockAuthService implements Partial<AuthService> {
  isAuthenticated = vi.fn().mockReturnValue(of(false));
}

class MockIdentityService implements Partial<IdentityService> {
  user$ = new BehaviorSubject(mockUser);
  get = vi.fn().mockImplementation(() => this.user$);
  set(data: AuthIdentity): void {
    this.user$.next(data);
  }
}

class MockCartAdapter implements Partial<CartAdapter> {
  getAll = vi.fn().mockReturnValue(of([]));
  get = vi.fn().mockReturnValue(of({}));
  addEntry = vi.fn().mockReturnValue(of({}));
  deleteEntry = vi.fn().mockReturnValue(of(null));
  updateEntry = vi.fn().mockReturnValue(of({}));
  create = vi.fn().mockReturnValue(of({}));
  delete = vi.fn().mockReturnValue(of({}));
}

describe('DefaultCartService', () => {
  let service: CartService;
  let adapter: MockCartAdapter;

  const cartCallback = vi.fn();
  const statusCallback = vi.fn();

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: CartAdapter,
          useClass: MockCartAdapter,
        },
        {
          provide: CartService,
          useClass: DefaultCartService,
        },
        {
          provide: IdentityService,
          useClass: MockIdentityService,
        },
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
        {
          provide: QueryService,
          useClass: DefaultQueryService,
        },
      ],
    });

    service = testInjector.inject(CartService);
    adapter = testInjector.inject(CartAdapter) as unknown as MockCartAdapter;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultCartService);
  });

  describe('getCart', () => {
    it('should return an observable with undefined if response without carts', () => {
      service.getCart().pipe(take(1)).subscribe(cartCallback);
      expect(cartCallback).toHaveBeenCalledWith(undefined);
    });

    describe('carts exist', () => {
      beforeEach(() => {
        adapter.getAll.mockReturnValue(of([mockBaseCart, mockDefaultCart]));
        adapter.get.mockReturnValue(of(mockBaseCart));
      });

      it('should return an observable', () => {
        expect(service.getCart()).toBeInstanceOf(Observable);
      });

      it('should return an observable with default cart if cartId has not been provided', () => {
        service.getCart().subscribe(cartCallback);
        expect(cartCallback).toHaveBeenCalledWith(mockDefaultCart);
      });

      it('should return an observable with a cart by provided cartId', () => {
        service.getCart({ cartId: 'cart' }).subscribe(cartCallback);
        expect(cartCallback).toHaveBeenCalledWith(mockBaseCart);
      });
    });
  });

  describe('createCart', () => {
    const qualifier = { name: 'mock' };

    beforeEach(() => {
      service.createCart(qualifier).subscribe();
    });

    it('should call create method of adapter with proper qualifier', () => {
      expect(adapter.create).toHaveBeenCalledWith(qualifier);
    });
  });

  describe('deleteCart', () => {
    const qualifier = { cartId: 'mock' };

    beforeEach(() => {
      service.deleteCart(qualifier).subscribe();
    });

    it('should call delete method of adapter with proper qualifier', () => {
      expect(adapter.delete).toHaveBeenCalledWith(qualifier);
    });
  });

  describe('addEntry', () => {
    beforeEach(() => {
      adapter.getAll.mockReturnValue(of([mockDefaultCart]));
    });

    it('should return an observable', () => {
      expect(service.addEntry(mockEntryQualifier)).toBeInstanceOf(Observable);
    });

    it('should trigger addEntry method of the CartAdapter', () => {
      service.addEntry(mockEntryQualifier).subscribe();

      expect(adapter.addEntry).toHaveBeenCalledWith({
        cartId: mockDefaultCart.id,
        ...mockEntryQualifier,
      });
    });

    it('should add entry to the active cart if cartId has not been provided', () => {
      adapter.addEntry.mockReturnValue(of(mockDefaultCart));

      service
        .addEntry(mockEntryQualifier)
        .pipe(
          switchMap((status) => {
            statusCallback(status);
            return service.getCart().pipe(take(1));
          })
        )
        .subscribe(cartCallback);

      expect(statusCallback).toHaveBeenCalledWith(mockDefaultCart);
      expect(cartCallback).toHaveBeenCalledWith(mockDefaultCart);
      expect(adapter.addEntry).toHaveBeenCalledWith({
        cartId: mockDefaultCart.id,
        ...mockEntryQualifier,
      });
    });

    it('should add entry to the cart with provided cartId', () => {
      adapter.addEntry.mockReturnValue(of(mockBaseCart));

      service
        .addEntry({ cartId: 'cart', ...mockEntryQualifier })
        .pipe(
          switchMap((status) => {
            statusCallback(status);
            return service.getCart({ cartId: 'cart' });
          })
        )
        .subscribe(cartCallback);

      expect(statusCallback).toHaveBeenCalledWith(mockBaseCart);
      expect(cartCallback).toHaveBeenCalledWith({
        ...mockBaseCart,
        products: mockBaseCart.products,
      });
      expect(adapter.addEntry).toHaveBeenCalledWith({
        cartId: 'cart',
        ...mockEntryQualifier,
      });
    });
  });

  describe('updateEntry', () => {
    beforeEach(() => {
      adapter.getAll.mockReturnValue(of([mockDefaultCart, mockBaseCart]));
    });

    it('should return an observable', () => {
      expect(service.updateEntry(mockUpdateEntryQualifier)).toBeInstanceOf(
        Observable
      );
    });

    it('should trigger updateEntry method of the CartAdapter', () => {
      adapter.updateEntry.mockReturnValue(of(mockBaseCart));
      service.updateEntry(mockUpdateEntryQualifier).subscribe();

      expect(adapter.updateEntry).toHaveBeenCalled();
    });

    it('should update entry of an active cart', () => {
      const mockUpdatedCartEntry = {
        ...mockDefaultCart,
        products: [
          {
            ...mockCartEntry,
            quantity: mockUpdateEntryQualifier.quantity,
          },
        ],
      };
      adapter.updateEntry.mockReturnValue(of(mockUpdatedCartEntry));

      service
        .updateEntry(mockUpdateEntryQualifier)
        .pipe(
          switchMap((status) => {
            statusCallback(status);

            return service.getCart();
          })
        )
        .subscribe(cartCallback);

      expect(statusCallback).toHaveBeenCalledWith(mockUpdatedCartEntry);
      expect(cartCallback).toHaveBeenCalledWith(mockUpdatedCartEntry);
    });

    it('should update entry of a cart with provided cartId', () => {
      const mockUpdatedCartEntry = {
        ...mockBaseCart,
        products: [
          {
            ...mockCartEntry,
            quantity: mockUpdateEntryQualifier.quantity,
          },
        ],
      };
      adapter.updateEntry.mockReturnValue(of(mockUpdatedCartEntry));

      service
        .updateEntry({
          cartId: 'cart',
          ...mockUpdateEntryQualifier,
        })
        .pipe(
          switchMap((status) => {
            statusCallback(status);

            return service.getCart({ cartId: 'cart' });
          })
        )
        .subscribe(cartCallback);

      expect(statusCallback).toHaveBeenCalledWith(mockUpdatedCartEntry);
      expect(cartCallback).toHaveBeenCalledWith(mockUpdatedCartEntry);
    });
  });

  describe('deleteEntry', () => {
    beforeEach(() => {
      adapter.getAll.mockReturnValue(of([mockDefaultCart, mockBaseCart]));
    });

    it('should return an observable', () => {
      expect(service.deleteEntry({ groupKey: 'groupKey' })).toBeInstanceOf(
        Observable
      );
    });

    it('should trigger deleteEntry and reload the cart', () => {
      adapter.getAll.mockReturnValue(of([mockBaseCart]));
      adapter.get.mockReturnValue(of(mockBaseCart));

      service.getCart().pipe(take(2)).subscribe();
      service.deleteEntry({ groupKey: 'groupKey' });

      expect(adapter.deleteEntry).toHaveBeenCalledWith({
        cartId: 'cart',
        groupKey: 'groupKey',
      });
      expect(adapter.get).toHaveBeenCalledWith({ cartId: 'cart' });
    });

    it('should delete entry of the active cart', () => {
      adapter.get.mockReturnValue(of(mockDefaultCart));

      service.deleteEntry({ groupKey: 'groupKey' }).subscribe(statusCallback);

      expect(statusCallback).toHaveBeenCalled();
    });

    it('should delete entry of the cart by provided cartId', () => {
      adapter.get.mockReturnValue(of(mockEmptyCart));

      service
        .deleteEntry({ cartId: 'cart', groupKey: 'groupKey' })
        .subscribe(statusCallback);

      expect(statusCallback).toHaveBeenCalledWith(null);
      expect(adapter.deleteEntry).toHaveBeenCalledWith({
        cartId: 'cart',
        groupKey: 'groupKey',
      });
    });
  });

  describe('getEntries', () => {
    it('should return an observable', () => {
      expect(service.getEntries()).toBeInstanceOf(Observable);
    });

    it('should return empty array if cart is not exist', () => {
      service.getEntries().pipe(take(1)).subscribe(statusCallback);

      expect(statusCallback).toHaveBeenCalledWith([]);
    });

    it('should return cart entries of the active cart', () => {
      adapter.getAll.mockReturnValue(of([mockBaseCart, mockDefaultCart]));
      service.getEntries().pipe(take(1)).subscribe(statusCallback);

      expect(statusCallback).toHaveBeenCalledWith(mockDefaultCart.products);
    });

    it('should return cart entries of the cart by provided cartId', () => {
      adapter.get.mockReturnValue(of(mockBaseCart));
      service
        .getEntries({ cartId: 'cart' })
        .pipe(take(1))
        .subscribe(statusCallback);

      expect(statusCallback).toHaveBeenCalledWith(mockBaseCart.products);
    });
  });

  describe('error handling', () => {
    beforeEach(() => {
      adapter.getAll.mockReturnValue(of([mockBaseCart, mockDefaultCart]));
      adapter.get.mockReturnValue(of(mockBaseCart));
      adapter.addEntry.mockImplementation(() =>
        throwError(() => mockErrorMessage)
      );
      adapter.deleteEntry.mockImplementation(() =>
        throwError(() => mockErrorMessage)
      );
      adapter.updateEntry.mockImplementation(() =>
        throwError(() => mockErrorMessage)
      );
    });

    it('should return an observable', () => {
      expect(service.getCartState()).toBeInstanceOf(Observable);
    });

    describe('should error for operations on an active cart', () => {
      it('on addEntry', () => {
        service.addEntry(mockEntryQualifier).subscribe({
          error: statusCallback,
        });
        expect(statusCallback).toHaveBeenCalledWith(mockErrorMessage);
      });

      it('on deleteEntry', () => {
        service.deleteEntry({ groupKey: 'groupKey' }).subscribe({
          error: statusCallback,
        });

        expect(statusCallback).toHaveBeenCalledWith(mockErrorMessage);
      });

      it('on updateEntry', () => {
        service.updateEntry(mockUpdateEntryQualifier).subscribe({
          error: statusCallback,
        });

        expect(statusCallback).toHaveBeenCalledWith(mockErrorMessage);
      });
    });

    describe('should update error ReplaySubject for a cart with provided cartId', () => {
      it('on addEntry', () => {
        service.addEntry({ cartId: 'cart', ...mockEntryQualifier }).subscribe({
          error: statusCallback,
        });
        expect(statusCallback).toHaveBeenCalledWith(mockErrorMessage);
      });

      it('on deleteEntry', () => {
        service
          .deleteEntry({ cartId: 'cart', groupKey: 'groupKey' })
          .subscribe({
            error: statusCallback,
          });

        expect(statusCallback).toHaveBeenCalledWith(mockErrorMessage);
      });

      it('on updateEntry', () => {
        service
          .updateEntry({ cartId: 'cart', ...mockUpdateEntryQualifier })
          .subscribe({
            error: statusCallback,
          });

        expect(statusCallback).toHaveBeenCalledWith(mockErrorMessage);
      });
    });
  });

  describe('isEmpty', () => {
    describe('when cart is empty', () => {
      beforeEach(() => {
        service.isEmpty().subscribe(statusCallback);
      });

      it('should return true', () => {
        expect(statusCallback).toHaveBeenCalledWith(true);
      });
    });

    describe('when cart contains products', () => {
      beforeEach(() => {
        adapter.getAll.mockReturnValue(of([mockDefaultCart]));
        service.isEmpty().subscribe(statusCallback);
      });

      it('should return false', () => {
        expect(statusCallback).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('isBusy', () => {
    beforeEach(() => {
      service.isBusy().subscribe(statusCallback);
    });

    it('should return current state', () => {
      expect(statusCallback).toHaveBeenCalledWith(false);
    });
  });
});
