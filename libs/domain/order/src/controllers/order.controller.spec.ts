import * as core from '@spryker-oryx/core';
import * as litRxjs from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';
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

describe('OrderController', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when order reference is provided', () => {
    it('should expose it', () => {
      const orderController = new OrderController(mockThis);
      const callback = vi.fn();
      orderController.getRef().subscribe(callback);

      expect(callback).toHaveBeenCalledWith(mockRef);
    });
  });
});
