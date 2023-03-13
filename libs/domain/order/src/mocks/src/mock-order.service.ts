import { OrderData, OrderService } from '@spryker-oryx/order';
import { Observable, of } from 'rxjs';
import { mockOrderData } from './mock-order';

export enum OrderItemCount {
  UnderThreshold = 'under-threshold',
  AboveThreshold = 'above-threshold',
}

export class MockOrderService implements Partial<OrderService> {
  protected itemCount = OrderItemCount.AboveThreshold;
  static mockOrder: OrderData = {
    ...mockOrderData,
    items: [],
  };
  get(): Observable<OrderData | null> {
    return of(mockOrderData);
  }

  changeItemCount(value: OrderItemCount) {
    this.itemCount = value;
  }

  getLastOrder(): Observable<OrderData | null> {
    MockOrderService.mockOrder.items =
      this.itemCount === OrderItemCount.UnderThreshold
        ? mockOrderData.items.slice(0, 6)
        : mockOrderData.items;
    return of(MockOrderService.mockOrder);
  }
}
