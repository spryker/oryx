import { AuthIdentity, IdentityService } from '@spryker-oryx/auth';
import { StorageService, StorageType } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { mockOrderData } from '@spryker-oryx/order/mocks';
import { Observable, firstValueFrom, of } from 'rxjs';
import { OrderData, orderStorageKey } from '../models';
import { OrderAdapter } from './adapter';
import { DefaultOrderService } from './default-order.service';
import { OrderService } from './order.service';

const mockAnonymousUser: AuthIdentity = {
  userId: 'anon-user-id',
  isAuthenticated: false,
};

const mockUser: AuthIdentity = {
  userId: 'userId',
  isAuthenticated: true,
};

class MockOrderAdapter implements Partial<OrderAdapter> {
  get = vi.fn().mockReturnValue(of(mockOrderData));
}

class MockIdentityService implements Partial<IdentityService> {
  get = vi.fn().mockReturnValue(of(mockAnonymousUser));
}

class MockStorageService implements Partial<StorageService> {
  get = vi.fn().mockReturnValue(of(mockSanitizedResponse));
  set = vi.fn().mockReturnValue(of(undefined));
  remove = vi.fn().mockReturnValue(of(undefined));
}

const { shippingAddress, billingAddress, ...mockSanitizedResponse } =
  mockOrderData;

const mockGetOrderProps = { id: 'mockid' };

describe('DefaultOrderService', () => {
  let service: OrderService;
  let adapter: MockOrderAdapter;
  let storage: MockStorageService;
  let identity: MockIdentityService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: OrderService,
          useClass: DefaultOrderService,
        },
        {
          provide: OrderAdapter,
          useClass: MockOrderAdapter,
        },
        {
          provide: IdentityService,
          useClass: MockIdentityService,
        },
        {
          provide: StorageService,
          useClass: MockStorageService,
        },
      ],
    });

    service = testInjector.inject(OrderService);
    adapter = testInjector.inject(OrderAdapter) as MockOrderAdapter;
    storage = testInjector.inject(
      StorageService
    ) as unknown as MockStorageService;
    identity = testInjector.inject(
      IdentityService
    ) as unknown as MockIdentityService;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultOrderService);
  });

  describe('when get is called', () => {
    const cb = vi.fn();
    beforeEach(() => {
      service.get(mockGetOrderProps).subscribe(cb);
    });

    it('should return an observable', () => {
      expect(service.get(mockGetOrderProps)).toBeInstanceOf(Observable);
      expect(cb).toHaveBeenCalledWith(mockSanitizedResponse);
    });

    it('should not call adapter', () => {
      expect(adapter.get).not.toHaveBeenCalled();
    });

    it('should not clear last order', () => {
      expect(storage.remove).not.toHaveBeenCalled();
    });

    it('should call getLastOrder', () => {
      expect(storage.get).toHaveBeenCalledWith(
        orderStorageKey,
        StorageType.Session
      );
    });

    describe('and get is called with a different id', () => {
      beforeEach(() => {
        service.get({ id: 'mockid2' }).subscribe(cb);
      });

      it('should clear last order', () => {
        expect(storage.remove).toHaveBeenCalledWith(
          orderStorageKey,
          StorageType.Session
        );
      });

      it('should not call the adapter', () => {
        service.get(mockGetOrderProps).subscribe();
        expect(adapter.get).not.toHaveBeenCalled();
      });

      it('should return a null observable', () => {
        expect(cb).toHaveBeenCalledWith(null);
      });
    });

    describe('and user id does not match', () => {
      beforeEach(() => {
        mockAnonymousUser.userId = 'another-anon';
        service.get(mockGetOrderProps).subscribe(cb);
      });

      it('should clear last order', () => {
        expect(storage.remove).toHaveBeenCalledWith(
          orderStorageKey,
          StorageType.Session
        );
      });

      it('should not call the adapter', () => {
        service.get(mockGetOrderProps).subscribe();
        expect(adapter.get).not.toHaveBeenCalled();
      });

      it('should return a null observable', () => {
        expect(cb).toHaveBeenCalledWith(null);
      });
    });

    describe('and user is logged in', () => {
      beforeEach(() => {
        identity.get.mockReturnValue(of(mockUser));
        service.get(mockGetOrderProps).subscribe(cb);
      });

      it('should not call getLastOrder', () => {
        expect(storage.get).toHaveBeenCalledTimes(1);
      });

      it('should call adapter', () => {
        service.get(mockGetOrderProps).subscribe();
        expect(adapter.get).toHaveBeenCalledWith(mockGetOrderProps);
      });

      it('should clear last order', () => {
        expect(storage.remove).toHaveBeenCalledWith(
          orderStorageKey,
          StorageType.Session
        );
      });

      it('should return observable', () => {
        expect(service.get(mockGetOrderProps)).toBeInstanceOf(Observable);
        expect(cb).toHaveBeenCalledWith(mockOrderData);
      });
    });
  });

  describe('when getLastOrder is called', () => {
    let result: OrderData | null;
    beforeEach(async () => {
      result = await firstValueFrom(service.getLastOrder());
    });
    it('should return previous order details', () => {
      expect(result).toEqual(mockSanitizedResponse);
    });
    it('should call storage get', () => {
      expect(storage.get).toHaveBeenCalledWith(
        orderStorageKey,
        StorageType.Session
      );
    });
  });

  describe('when storeLastOrder is called', () => {
    it('should call storage set', () => {
      service.storeLastOrder(mockOrderData, 'anon-user-id');
      expect(storage.set).toHaveBeenCalledWith(
        orderStorageKey,
        mockSanitizedResponse,
        StorageType.Session
      );
    });
  });
});
