import { HttpErrorResponse } from '@spryker-oryx/core';
import {
  createInjector,
  destroyInjector,
  Injector,
} from '@spryker-oryx/injector';
import { Observable, of } from 'rxjs';
import {
  mockCartTotals,
  mockDefaultCartTotals,
  mockNormalizedCart,
  mockNormalizedCartEntry,
  mockNormalizedCartWithoutProducts,
  mockNormalizedDefaultCart,
  mockNormalizedDefaultCartWithoutProducts,
} from '../mocks/mock-cart';
import { Cart } from '../models';
import { CartAdapter } from './adapter/cart.adapter';
import { CartService } from './cart.service';
import { DefaultCartService } from './default-cart.service';
import { UserService } from './user.service';

const mockErrorMessage = 'Test Error Message';

const mockUser = {
  anonymousUserId: 'anonymous-user-id',
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

class MockUserService implements Partial<UserService> {
  get = vi.fn().mockImplementation(() => of(mockUser));
}

class MockCartAdapter implements Partial<CartAdapter> {
  getAll = vi.fn().mockReturnValue(of([]));
  get = vi.fn().mockReturnValue(of({}));
  addEntry = vi.fn().mockReturnValue(of({}));
  deleteEntry = vi.fn().mockReturnValue(of(null));
  updateEntry = vi.fn().mockReturnValue(of({}));
}

describe('DefaultCartService', () => {
  let service: CartService;
  let adapter: MockCartAdapter;
  let testInjector: Injector;

  let cart$: Observable<Cart | null>;
  const cartCallback = vi.fn();
  const statusCallback = vi.fn();

  beforeEach(() => {
    testInjector = createInjector({
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
          provide: UserService,
          useClass: MockUserService,
        },
      ],
    });

    service = testInjector.inject(CartService);
    adapter = <MockCartAdapter>testInjector.inject(CartAdapter);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultCartService);
  });

  describe('load', () => {
    it('should trigger getAll method of the CartAdapter', () => {
      service.load();

      expect(adapter.getAll).toHaveBeenCalledTimes(1);
      expect(adapter.getAll).toHaveBeenCalledWith({
        anonymousUserId: 'anonymous-user-id',
      });
    });

    it('should not load the list of carts if carts was already loaded', () => {
      adapter.getAll.mockReturnValue(of([mockNormalizedCart]));

      service.load();
      expect(adapter.getAll).toHaveBeenCalledTimes(1);

      service.load();
      expect(adapter.getAll).toHaveBeenCalledTimes(1);
    });

    it('should force load the list of carts', () => {
      adapter.getAll.mockReturnValue(
        of([mockNormalizedCart, mockNormalizedDefaultCart])
      );

      service.load();
      expect(adapter.getAll).toHaveBeenCalledTimes(1);

      service.load({ forceReload: true });
      expect(adapter.getAll).toHaveBeenCalledTimes(2);
    });
  });

  describe('getCart', () => {
    it('should return an observable', () => {
      expect(service.getCart()).toBeInstanceOf(Observable);
    });

    it('should trigger getAll method of the CartAdapter', () => {
      service.getCart().subscribe();

      expect(adapter.getAll).toHaveBeenCalledWith(mockUser);
    });

    it('should return an observable with default cart if cartId has not been provided', () => {
      adapter.getAll.mockReturnValueOnce(
        of([mockNormalizedDefaultCart, mockNormalizedCart])
      );

      service.load();
      service.getCart().subscribe(cartCallback);

      expect(cartCallback).toHaveBeenCalledWith(mockNormalizedDefaultCart);
    });

    it('should return an observable with a cart by provided cartId', () => {
      adapter.getAll.mockReturnValueOnce(
        of([mockNormalizedDefaultCart, mockNormalizedCart])
      );

      service.load();
      service.getCart({ cartId: 'cart' }).subscribe(cartCallback);

      expect(cartCallback).toHaveBeenCalledWith(mockNormalizedCart);
    });

    it('should return an observable with null if response without carts', () => {
      service.getCart().subscribe(cartCallback);

      expect(cartCallback).toHaveBeenCalledWith(null);
    });
  });

  describe('addEntry', () => {
    beforeEach(() => {
      adapter.getAll.mockReturnValueOnce(
        of([
          mockNormalizedDefaultCartWithoutProducts,
          mockNormalizedCartWithoutProducts,
        ])
      );

      service.load();
    });

    it('should return an observable', () => {
      expect(service.addEntry(mockEntryQualifier)).toBeInstanceOf(Observable);
    });

    it('should trigger addEntry method of the CartAdapter', () => {
      service.addEntry(mockEntryQualifier).subscribe();

      expect(adapter.addEntry).toHaveBeenCalledWith({
        cartId: 'default',
        attributes: mockEntryQualifier,
        user: mockUser,
      });
    });

    it('should add entry to the active cart if cartId has not been provided', () => {
      adapter.addEntry.mockReturnValueOnce(of(mockNormalizedDefaultCart));

      cart$ = service.getCart();
      service.addEntry(mockEntryQualifier).subscribe(statusCallback);
      cart$.subscribe(cartCallback);

      expect(statusCallback).toHaveBeenCalledWith(null);
      expect(cartCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockNormalizedDefaultCart,
          products: [mockNormalizedCartEntry],
        })
      );
      expect(adapter.addEntry).toHaveBeenCalledWith({
        cartId: 'default',
        attributes: mockEntryQualifier,
        user: mockUser,
      });
    });

    it('should add entry to the cart with provided cartId', () => {
      adapter.addEntry.mockReturnValueOnce(of(mockNormalizedCart));

      cart$ = service.getCart({ cartId: 'cart' });
      service
        .addEntry({ cartId: 'cart', ...mockEntryQualifier })
        .subscribe(statusCallback);
      cart$.subscribe(cartCallback);

      expect(statusCallback).toHaveBeenCalledWith(null);
      expect(cartCallback).toHaveBeenCalledWith({
        ...mockNormalizedCart,
        products: [mockNormalizedCartEntry],
      });
      expect(adapter.addEntry).toHaveBeenCalledWith({
        cartId: 'cart',
        attributes: mockEntryQualifier,
        user: mockUser,
      });
    });
  });

  describe('updateEntry', () => {
    beforeEach(() => {
      adapter.getAll.mockReturnValueOnce(
        of([mockNormalizedDefaultCart, mockNormalizedCart])
      );

      service.load();
    });

    it('should return an observable', () => {
      expect(service.updateEntry(mockUpdateEntryQualifier)).toBeInstanceOf(
        Observable
      );
    });

    it('should trigger updateEntry method of the CartAdapter', () => {
      adapter.updateEntry.mockReturnValueOnce(of(mockNormalizedCart));

      service.updateEntry(mockUpdateEntryQualifier).subscribe();

      expect(adapter.updateEntry).toHaveBeenCalled();
    });

    it('should update entry of an active cart', () => {
      const mockUpdatedCartEntry = {
        ...mockNormalizedDefaultCart,
        products: [
          {
            ...mockNormalizedCartEntry,
            quantity: mockUpdateEntryQualifier.quantity,
          },
        ],
      };
      adapter.updateEntry.mockReturnValueOnce(of(mockUpdatedCartEntry));

      cart$ = service.getCart();
      service.updateEntry(mockUpdateEntryQualifier).subscribe(statusCallback);
      cart$.subscribe(cartCallback);

      expect(statusCallback).toHaveBeenCalledWith(null);
      expect(cartCallback).toHaveBeenCalledWith(mockUpdatedCartEntry);
    });

    it('should update entry of a cart with provided cartId', () => {
      const mockUpdatedCartEntry = {
        ...mockNormalizedCart,
        products: [
          {
            ...mockNormalizedCartEntry,
            quantity: mockUpdateEntryQualifier.quantity,
          },
        ],
      };
      adapter.updateEntry.mockReturnValueOnce(of(mockUpdatedCartEntry));

      cart$ = service.getCart({ cartId: 'cart' });
      service
        .updateEntry({
          cartId: 'cart',
          ...mockUpdateEntryQualifier,
        })
        .subscribe(statusCallback);
      cart$.subscribe(cartCallback);

      expect(statusCallback).toHaveBeenCalledWith(null);
      expect(cartCallback).toHaveBeenCalledWith(mockUpdatedCartEntry);
    });
  });

  describe('deleteEntry', () => {
    beforeEach(() => {
      adapter.getAll.mockReturnValueOnce(
        of([mockNormalizedDefaultCart, mockNormalizedCart])
      );
      service.load();
    });

    it('should return an observable', () => {
      expect(service.deleteEntry({ groupKey: 'groupKey' })).toBeInstanceOf(
        Observable
      );
    });

    it('should trigger deleteEntry and get of the CartAdapter', () => {
      adapter.get.mockReturnValueOnce(of(mockNormalizedCart));
      service.deleteEntry({ groupKey: 'groupKey' }).subscribe();

      expect(adapter.deleteEntry).toHaveBeenCalled();
      expect(adapter.get).toHaveBeenCalled();
    });

    it('should delete entry of the active cart', () => {
      adapter.get.mockReturnValue(of(mockNormalizedDefaultCartWithoutProducts));

      cart$ = service.getCart();
      cart$.subscribe(cartCallback);
      service.deleteEntry({ groupKey: 'groupKey' }).subscribe(statusCallback);

      expect(statusCallback).toHaveBeenCalledWith(null);
      expect(cartCallback).toHaveBeenCalledWith(
        mockNormalizedDefaultCartWithoutProducts
      );
    });

    it('should delete entry of the cart by provided cartId', () => {
      adapter.get.mockReturnValue(of(mockNormalizedDefaultCartWithoutProducts));

      cart$ = service.getCart({ cartId: 'cart' });
      cart$.subscribe(cartCallback);
      service
        .deleteEntry({ cartId: 'cart', groupKey: 'groupKey' })
        .subscribe(statusCallback);

      expect(statusCallback).toHaveBeenCalledWith(null);
      expect(cartCallback).toHaveBeenCalledWith(mockNormalizedCart);
    });
  });

  describe('getTotals', () => {
    it('should return an observable', () => {
      expect(service.getTotals()).toBeInstanceOf(Observable);
    });

    it('should return null if cart is not exist', () => {
      adapter.getAll.mockReturnValueOnce(of([]));

      service.load();
      service.getTotals().subscribe(statusCallback);

      expect(statusCallback).toHaveBeenCalledWith(null);
    });

    it('should return cart totals of the active cart', () => {
      adapter.getAll.mockReturnValueOnce(
        of([mockNormalizedCart, mockNormalizedDefaultCart])
      );

      service.load();
      service.getTotals().subscribe(statusCallback);

      expect(statusCallback).toHaveBeenCalledWith(mockDefaultCartTotals);
    });

    it('should return cart totals of the cart by provided cartId', () => {
      adapter.getAll.mockReturnValueOnce(
        of([mockNormalizedCart, mockNormalizedDefaultCart])
      );

      service.load();
      service.getTotals({ cartId: 'cart' }).subscribe(statusCallback);

      expect(statusCallback).toHaveBeenCalledWith(mockCartTotals);
    });
  });

  describe('getEntries', () => {
    it('should return an observable', () => {
      expect(service.getEntries()).toBeInstanceOf(Observable);
    });

    it('should return empty array if cart is not exist', () => {
      adapter.getAll.mockReturnValueOnce(of([]));

      service.load();
      service.getEntries().subscribe(statusCallback);

      expect(statusCallback).toHaveBeenCalledWith([]);
    });

    it('should return cart entries of the active cart', () => {
      adapter.getAll.mockReturnValueOnce(
        of([mockNormalizedCart, mockNormalizedDefaultCart])
      );

      service.load();
      service.getEntries().subscribe(statusCallback);

      expect(statusCallback).toHaveBeenCalledWith([mockNormalizedCartEntry]);
    });

    it('should return cart entries of the cart by provided cartId', () => {
      adapter.getAll.mockReturnValueOnce(
        of([mockNormalizedCart, mockNormalizedDefaultCart])
      );

      service.load();
      service.getEntries({ cartId: 'cart' }).subscribe(statusCallback);

      expect(statusCallback).toHaveBeenCalledWith([mockNormalizedCartEntry]);
    });
  });

  describe('error handling with getCartError', () => {
    let error$: Observable<HttpErrorResponse | null>;

    beforeEach(() => {
      adapter.getAll.mockReturnValue(
        of([mockNormalizedCart, mockNormalizedDefaultCart])
      );
      adapter.addEntry.mockImplementation(() => {
        throw mockErrorMessage;
      });
      adapter.deleteEntry.mockImplementation(() => {
        throw mockErrorMessage;
      });
      adapter.updateEntry.mockImplementation(() => {
        throw mockErrorMessage;
      });

      service.load();
    });

    it('should return an observable', () => {
      expect(service.getCartError()).toBeInstanceOf(Observable);
    });

    describe('should update error ReplaySubject for an active cart', () => {
      beforeEach(() => {
        error$ = service.getCartError();
      });

      it('on addEntry', () => {
        service.addEntry(mockEntryQualifier).subscribe({
          error: statusCallback,
        });
        error$.subscribe(cartCallback);

        expect(cartCallback).toHaveBeenCalledWith(mockErrorMessage);
        expect(statusCallback).toHaveBeenCalledWith(mockErrorMessage);
      });

      it('on deleteEntry', () => {
        service.deleteEntry({ groupKey: 'groupKey' }).subscribe({
          error: statusCallback,
        });
        error$.subscribe(cartCallback);

        expect(statusCallback).toHaveBeenCalledWith(mockErrorMessage);
        expect(cartCallback).toHaveBeenCalledWith(mockErrorMessage);
      });

      it('on updateEntry', () => {
        service.updateEntry(mockUpdateEntryQualifier).subscribe({
          error: statusCallback,
        });
        error$.subscribe(cartCallback);

        expect(statusCallback).toHaveBeenCalledWith(mockErrorMessage);
        expect(cartCallback).toHaveBeenCalledWith(mockErrorMessage);
      });
    });

    describe('should update error ReplaySubject for a cart with provided cartId', () => {
      beforeEach(() => {
        error$ = service.getCartError({ cartId: 'cart' });
      });

      it('on addEntry', () => {
        service.addEntry({ cartId: 'cart', ...mockEntryQualifier }).subscribe({
          error: statusCallback,
        });
        error$.subscribe(cartCallback);

        expect(statusCallback).toHaveBeenCalledWith(mockErrorMessage);
        expect(cartCallback).toHaveBeenCalledWith(mockErrorMessage);
      });

      it('on deleteEntry', () => {
        service
          .deleteEntry({ cartId: 'cart', groupKey: 'groupKey' })
          .subscribe({
            error: statusCallback,
          });
        error$.subscribe(cartCallback);

        expect(statusCallback).toHaveBeenCalledWith(mockErrorMessage);
        expect(cartCallback).toHaveBeenCalledWith(mockErrorMessage);
      });

      it('on updateEntry', () => {
        service
          .updateEntry({ cartId: 'cart', ...mockUpdateEntryQualifier })
          .subscribe({
            error: statusCallback,
          });
        error$.subscribe(cartCallback);

        expect(statusCallback).toHaveBeenCalledWith(mockErrorMessage);
        expect(cartCallback).toHaveBeenCalledWith(mockErrorMessage);
      });
    });
  });
});
