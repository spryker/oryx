import { OrderData, OrderService } from '@spryker-oryx/order';
import { Observable, of } from 'rxjs';
import { mockOrderData } from './mock-order';

export class MockOrderService implements Partial<OrderService> {
  get(): Observable<OrderData | null> {
    return of(mockOrderData);
  }

  getLastOrder(): Observable<OrderData | null> {
    return of(mockOrderData);
  }
}
