import { OrderData, OrderService } from '@spryker-oryx/order';
import { Observable, of } from 'rxjs';
import { mockOrderData } from './mock-order';

export class MockOrderService implements Partial<OrderService> {
  static mockOrder: OrderData = {
    ...mockOrderData,
  };

  get(): Observable<OrderData | null> {
    return of(MockOrderService.mockOrder);
  }

  getLastOrder(): Observable<OrderData | null> {
    return of(MockOrderService.mockOrder);
  }

  clearLastOrder(): void {
    //mock
  }
}
