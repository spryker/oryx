import { AuthIdentity, IdentityService } from '@spryker-oryx/auth';
import * as core from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { mockOrderData } from '@spryker-oryx/order/mocks';
import * as litRxjs from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { Observable, of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { OrderService } from '../services';
import { OrderController } from './order.controller';

const mockRef = 'mockRef';
const mockThis = {} as LitElement;

const mockContext = {
  get: vi.fn().mockReturnValue(of(mockRef)),
};
vi.spyOn(core, 'ContextController') as SpyInstance;
(core.ContextController as unknown as SpyInstance).mockReturnValue(mockContext);

const mockObserve = {
  get: vi.fn(),
};
vi.spyOn(litRxjs, 'ObserveController') as SpyInstance;
(litRxjs.ObserveController as unknown as SpyInstance).mockReturnValue(
  mockObserve
);

class MockOrderService implements Partial<OrderService> {
  getLastOrder = vi.fn().mockReturnValue(of(mockOrderData));
  get = vi.fn().mockReturnValue(of(mockOrderData));
  clearLastOrder = vi.fn();
}

const mockAnonymousUser: AuthIdentity = {
  userId: 'anon-user-id',
  isAuthenticated: false,
};

const mockUser: AuthIdentity = {
  userId: 'userId',
  isAuthenticated: true,
};

class MockIdentityService implements Partial<IdentityService> {
  get = vi
    .fn<[], Observable<AuthIdentity>>()
    .mockReturnValue(of(mockAnonymousUser));
}

describe('OrderController', () => {
  let order: MockOrderService;
  let identity: MockIdentityService;
  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: OrderService,
          useClass: MockOrderService,
        },
        {
          provide: IdentityService,
          useClass: MockIdentityService,
        },
      ],
    });
    order = testInjector.inject(OrderService) as unknown as MockOrderService;
    identity = testInjector.inject(IdentityService) as MockIdentityService;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  describe('when order reference is provided', () => {
    it('should expose it', () => {
      const orderController = new OrderController(mockThis);
      const callback = vi.fn();
      orderController.getRef().subscribe(callback);

      expect(callback).toHaveBeenCalledWith(mockRef);
    });
  });

  describe('when getOrder is called', () => {
    const callback = vi.fn();

    describe('and user is anonymous', () => {
      beforeEach(() => {
        mockContext.get.mockReturnValue(of('mockid'));
        const orderController = new OrderController(mockThis);
        orderController.getOrder().subscribe(callback);
      });

      afterEach(() => {
        mockContext.get.mockReturnValue(of(mockRef));
      });

      it('should call order service getLastOrder', () => {
        expect(order.getLastOrder).toHaveBeenCalled();
      });

      it('should not call order service get', () => {
        expect(order.get).not.toHaveBeenCalled();
      });

      it('should return observable', () => {
        expect(callback).toHaveBeenCalledWith(mockOrderData);
      });

      describe('and order id does not match', () => {
        beforeEach(() => {
          mockContext.get.mockReturnValue(of('mockid2'));
          const orderController = new OrderController(mockThis);
          orderController.getOrder().subscribe(callback);
        });

        it('should return null observable', () => {
          expect(callback).toHaveBeenCalledWith(null);
        });

        it('should call clearLastOrder', () => {
          expect(order.clearLastOrder).toHaveBeenCalled();
        });
      });

      describe('and user id does not match', () => {
        beforeEach(() => {
          mockAnonymousUser.userId = 'another-anon';
          const orderController = new OrderController(mockThis);
          orderController.getOrder().subscribe(callback);
        });

        it('should return null observable', () => {
          expect(callback).toHaveBeenCalledWith(null);
        });

        it('should call clearLastOrder', () => {
          expect(order.clearLastOrder).toHaveBeenCalled();
        });
      });
    });

    describe('and user is logged in', () => {
      beforeEach(() => {
        identity.get.mockReturnValue(of(mockUser));
        const orderController = new OrderController(mockThis);
        orderController.getOrder().subscribe(callback);
      });

      it('should not call order service getLastOrder', () => {
        expect(order.getLastOrder).not.toHaveBeenCalled();
      });

      it('should call order service get', () => {
        expect(order.get).toHaveBeenCalledWith({ id: mockRef });
      });

      it('should return observable', () => {
        expect(callback).toHaveBeenCalledWith(mockOrderData);
      });

      it('should call clearLastOrder', () => {
        expect(order.clearLastOrder).toHaveBeenCalled();
      });
    });

    describe('and order id is not provided', () => {
      beforeEach(() => {
        mockContext.get.mockReturnValue(of(null));
        const orderController = new OrderController(mockThis);
        orderController.getOrder().subscribe(callback);
      });

      it('should call order service getLastOrder', () => {
        expect(order.getLastOrder).toHaveBeenCalled();
      });

      it('should not call order service get', () => {
        expect(order.get).not.toHaveBeenCalled();
      });

      it('should return null observable', () => {
        expect(callback).toHaveBeenCalledWith(null);
      });

      it('should call clearLastOrder', () => {
        expect(order.clearLastOrder).toHaveBeenCalled();
      });
    });
  });
});
