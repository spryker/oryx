import { AuthService, Identity, IdentityService } from '@spryker-oryx/auth';
import {
  mockBaseCart,
  mockCartEntry,
  mockDefaultCart,
  mockEmptyCart,
  mockNetCart,
} from '@spryker-oryx/cart/mocks';
import { HttpErrorResponse } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { BehaviorSubject, Observable, of, switchMap, take } from 'rxjs';
import { CartAdapter } from './adapter/cart.adapter';
import { CartService } from './cart.service';
import { DefaultCartService } from './default-cart.service';

const mockErrorMessage = 'Test Error Message';

const mockUser = {
  id: 'userId',
  anonymous: false,
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
  set(data: Identity): void {
    this.user$.next(data);
  }
}

class MockCartAdapter implements Partial<CartAdapter> {
  getAll = vi.fn().mockReturnValue(of(null));
  get = vi.fn().mockReturnValue(of({}));
  addEntry = vi.fn().mockReturnValue(of({}));
  deleteEntry = vi.fn().mockReturnValue(of(null));
  updateEntry = vi.fn().mockReturnValue(of({}));
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
      ],
    });

    service = testInjector.inject(CartService);
    adapter = testInjector.inject(CartAdapter) as MockCartAdapter;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultCartService);
  });

  describe('initial subscriptions', () => {
    it('should load carts', () => {
      expect(adapter.getAll).toHaveBeenCalled();
    });
  });

  describe('load', () => {
    beforeEach(() => {
      adapter.getAll.mockClear();
    });

    it('should trigger getAll method of the CartAdapter', () => {
      service.load().pipe(take(1)).subscribe();

      expect(adapter.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCart', () => {
    it('should return an observable with null if response without carts', () => {
      service.getCart().pipe(take(1)).subscribe(cartCallback);

      expect(cartCallback).toHaveBeenCalledWith(null);
    });

    describe('carts exist', () => {
      beforeEach(() => {
        adapter.getAll.mockReturnValue(
          of([mockBaseCart, mockDefaultCart, mockNetCart])
        );
      });

      it('should return an observable', () => {
        expect(service.getCart()).toBeInstanceOf(Observable);
      });

      it('should return an observable with default cart if cartId has not been provided', () => {
        service
          .load()
          .pipe(
            take(1),
            switchMap(() => service.getCart())
          )
          .subscribe(cartCallback);

        expect(cartCallback).toHaveBeenCalledWith(mockDefaultCart);
      });

      it('should return an observable with a cart by provided cartId', () => {
        service
          .load()
          .pipe(
            take(1),
            switchMap(() => service.getCart({ cartId: 'cart' }))
          )
          .subscribe(cartCallback);

        expect(cartCallback).toHaveBeenCalledWith(mockBaseCart);
      });
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
      service
        .load()
        .pipe(
          take(1),
          switchMap(() => service.addEntry(mockEntryQualifier))
        )
        .subscribe();

      expect(adapter.addEntry).toHaveBeenCalledWith({
        cartId: mockDefaultCart.id,
        attributes: mockEntryQualifier,
      });
    });

    it('should add entry to the active cart if cartId has not been provided', () => {
      adapter.addEntry.mockReturnValue(of(mockDefaultCart));

      service
        .load()
        .pipe(
          take(1),
          switchMap(() => service.addEntry(mockEntryQualifier)),
          switchMap((status) => {
            statusCallback(status);

            return service.getCart().pipe(take(1));
          })
        )
        .subscribe(cartCallback);

      expect(statusCallback).toHaveBeenCalledWith(null);
      expect(cartCallback).toHaveBeenCalledWith(mockDefaultCart);
      expect(adapter.addEntry).toHaveBeenCalledWith({
        cartId: mockDefaultCart.id,
        attributes: mockEntryQualifier,
      });
    });

    it('should add entry to the cart with provided cartId', () => {
      adapter.addEntry.mockReturnValue(of(mockBaseCart));

      service
        .load()
        .pipe(
          take(1),
          switchMap(() =>
            service.addEntry({ cartId: 'cart', ...mockEntryQualifier })
          ),
          switchMap((status) => {
            statusCallback(status);

            return service.getCart({ cartId: 'cart' });
          })
        )
        .subscribe(cartCallback);

      expect(statusCallback).toHaveBeenCalledWith(null);
      expect(cartCallback).toHaveBeenCalledWith({
        ...mockBaseCart,
        products: mockBaseCart.products,
      });
      expect(adapter.addEntry).toHaveBeenCalledWith({
        cartId: 'cart',
        attributes: mockEntryQualifier,
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

      service
        .load()
        .pipe(
          take(1),
          switchMap(() => service.updateEntry(mockUpdateEntryQualifier))
        )
        .subscribe();

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
        .load()
        .pipe(
          take(1),
          switchMap(() => service.updateEntry(mockUpdateEntryQualifier)),
          switchMap((status) => {
            statusCallback(status);

            return service.getCart();
          })
        )
        .subscribe(cartCallback);

      expect(statusCallback).toHaveBeenCalledWith(null);
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
        .load()
        .pipe(
          take(1),
          switchMap(() =>
            service.updateEntry({
              cartId: 'cart',
              ...mockUpdateEntryQualifier,
            })
          ),
          switchMap((status) => {
            statusCallback(status);

            return service.getCart({ cartId: 'cart' });
          })
        )
        .subscribe(cartCallback);

      expect(statusCallback).toHaveBeenCalledWith(null);
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

    it('should trigger deleteEntry and get of the CartAdapter', () => {
      adapter.get.mockReturnValue(of(mockBaseCart));

      service
        .load()
        .pipe(
          take(1),
          switchMap(() => service.deleteEntry({ groupKey: 'groupKey' }))
        )
        .subscribe();

      expect(adapter.deleteEntry).toHaveBeenCalled();
      expect(adapter.get).toHaveBeenCalled();
    });

    it('should delete entry of the active cart', () => {
      adapter.get.mockReturnValue(of(mockDefaultCart));

      service
        .load()
        .pipe(
          take(1),
          switchMap(() => service.deleteEntry({ groupKey: 'groupKey' })),
          switchMap((status) => {
            statusCallback(status);

            return service.getCart();
          })
        )
        .subscribe(cartCallback);

      expect(statusCallback).toHaveBeenCalledWith(null);
      expect(cartCallback).toHaveBeenCalledWith(mockDefaultCart);
    });

    it('should delete entry of the cart by provided cartId', () => {
      adapter.get.mockReturnValue(of(mockEmptyCart));

      service
        .load()
        .pipe(
          take(1),
          switchMap(() =>
            service.deleteEntry({ cartId: 'cart', groupKey: 'groupKey' })
          ),
          switchMap((status) => {
            statusCallback(status);

            return service.getCart({ cartId: 'cart' });
          })
        )
        .subscribe(cartCallback);

      expect(statusCallback).toHaveBeenCalledWith(null);
      expect(cartCallback).toHaveBeenCalledWith(mockBaseCart);
    });
  });

  describe('getTotals', () => {
    it('should return an observable', () => {
      expect(service.getTotals()).toBeInstanceOf(Observable);
    });

    it('should return null if no carts', () => {
      service.getTotals().pipe(take(1)).subscribe(statusCallback);

      expect(statusCallback).toHaveBeenCalledWith(null);
    });

    it('should return cart totals of the active cart', () => {
      adapter.getAll.mockReturnValue(of([mockBaseCart, mockDefaultCart]));

      service
        .load()
        .pipe(
          take(1),
          switchMap(() => service.getTotals())
        )
        .subscribe(statusCallback);

      expect(statusCallback).toHaveBeenCalledWith(mockDefaultCart.totals);
    });

    it('should return cart totals of the cart by provided cartId', () => {
      adapter.getAll.mockReturnValue(of([mockBaseCart, mockDefaultCart]));

      service
        .load()
        .pipe(
          take(1),
          switchMap(() => service.getTotals({ cartId: 'cart' }))
        )
        .subscribe(statusCallback);

      expect(statusCallback).toHaveBeenCalledWith(mockBaseCart.totals);
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

      service
        .load()
        .pipe(
          take(1),
          switchMap(() => service.getEntries())
        )
        .subscribe(statusCallback);

      expect(statusCallback).toHaveBeenCalledWith(mockDefaultCart.products);
    });

    it('should return cart entries of the cart by provided cartId', () => {
      adapter.getAll.mockReturnValue(of([mockBaseCart, mockDefaultCart]));

      service
        .load()
        .pipe(
          take(1),
          switchMap(() => service.getEntries({ cartId: 'cart' }))
        )
        .subscribe(statusCallback);

      expect(statusCallback).toHaveBeenCalledWith(mockBaseCart.products);
    });
  });

  describe('error handling with getCartError', () => {
    let error$: Observable<HttpErrorResponse | null>;

    beforeEach(() => {
      adapter.getAll.mockReturnValue(of([mockBaseCart, mockDefaultCart]));
      adapter.addEntry.mockImplementation(() => {
        throw mockErrorMessage;
      });
      adapter.deleteEntry.mockImplementation(() => {
        throw mockErrorMessage;
      });
      adapter.updateEntry.mockImplementation(() => {
        throw mockErrorMessage;
      });

      service.load().pipe(take(1)).subscribe();
    });

    it('should return an observable', () => {
      expect(service.getCartError()).toBeInstanceOf(Observable);
    });

    describe('should update error ReplaySubject for an active cart', () => {
      beforeEach(() => {
        error$ = service.getCartError();
      });

      it('on addEntry', () => {
        service.addEntry(mockEntryQualifier).pipe(take(1)).subscribe({
          error: statusCallback,
        });
        error$.pipe(take(1)).subscribe(cartCallback);

        expect(cartCallback).toHaveBeenCalledWith(mockErrorMessage);
        expect(statusCallback).toHaveBeenCalledWith(mockErrorMessage);
      });

      it('on deleteEntry', () => {
        service.deleteEntry({ groupKey: 'groupKey' }).pipe(take(1)).subscribe({
          error: statusCallback,
        });
        error$.pipe(take(1)).subscribe(cartCallback);

        expect(statusCallback).toHaveBeenCalledWith(mockErrorMessage);
        expect(cartCallback).toHaveBeenCalledWith(mockErrorMessage);
      });

      it('on updateEntry', () => {
        service.updateEntry(mockUpdateEntryQualifier).pipe(take(1)).subscribe({
          error: statusCallback,
        });
        error$.pipe(take(1)).subscribe(cartCallback);

        expect(statusCallback).toHaveBeenCalledWith(mockErrorMessage);
        expect(cartCallback).toHaveBeenCalledWith(mockErrorMessage);
      });
    });

    describe('should update error ReplaySubject for a cart with provided cartId', () => {
      beforeEach(() => {
        error$ = service.getCartError({ cartId: 'cart' });
      });

      it('on addEntry', () => {
        service
          .addEntry({ cartId: 'cart', ...mockEntryQualifier })
          .pipe(take(1))
          .subscribe({
            error: statusCallback,
          });
        error$.pipe(take(1)).subscribe(cartCallback);

        expect(statusCallback).toHaveBeenCalledWith(mockErrorMessage);
        expect(cartCallback).toHaveBeenCalledWith(mockErrorMessage);
      });

      it('on deleteEntry', () => {
        service
          .deleteEntry({ cartId: 'cart', groupKey: 'groupKey' })
          .pipe(take(1))
          .subscribe({
            error: statusCallback,
          });
        error$.pipe(take(1)).subscribe(cartCallback);

        expect(statusCallback).toHaveBeenCalledWith(mockErrorMessage);
        expect(cartCallback).toHaveBeenCalledWith(mockErrorMessage);
      });

      it('on updateEntry', () => {
        service
          .updateEntry({ cartId: 'cart', ...mockUpdateEntryQualifier })
          .pipe(take(1))
          .subscribe({
            error: statusCallback,
          });
        error$.pipe(take(1)).subscribe(cartCallback);

        expect(statusCallback).toHaveBeenCalledWith(mockErrorMessage);
        expect(cartCallback).toHaveBeenCalledWith(mockErrorMessage);
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
        service.load().subscribe();
        service.isEmpty().subscribe(statusCallback);
      });

      it('should return false', () => {
        expect(statusCallback).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('getLoadingState', () => {
    beforeEach(() => {
      service.getLoadingState().subscribe(statusCallback);
    });

    it('should return current state', () => {
      expect(statusCallback).toHaveBeenCalledWith(false);
    });
  });
});
