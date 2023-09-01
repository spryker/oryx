import * as core from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { mockOrderData } from '@spryker-oryx/order/mocks';
import * as litRxjs from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { of } from 'rxjs';
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
  get = vi.fn().mockReturnValue(of(mockOrderData));
}

describe('OrderController', () => {
  let order: MockOrderService;
  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: OrderService,
          useClass: MockOrderService,
        },
      ],
    });
    order = testInjector.inject(OrderService) as unknown as MockOrderService;
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
    beforeEach(() => {
      const orderController = new OrderController(mockThis);
      orderController.getOrder().subscribe(callback);
    });

    it('should return observable', () => {
      expect(callback).toHaveBeenCalledWith(mockOrderData);
    });
  });
});
