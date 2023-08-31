import { Observable } from 'rxjs';
import { OrderData } from '../models';
import { GetOrderDataProps } from './adapter';

export interface OrderService {
  get(data: GetOrderDataProps): Observable<OrderData | null>;
  getLastOrder(): Observable<OrderData | null>;
  storeLastOrder(order: OrderData, userId: string): void;
  clearLastOrder(): void;
}

export const OrderService = 'oryx.OrderService';

declare global {
  interface InjectionTokensContractMap {
    [OrderService]: OrderService;
  }
}
