import { Observable } from 'rxjs';
import { OrderData } from '../models';
import { GetOrderDataProps } from './adapter';

export interface OrderService {
  get(data: GetOrderDataProps): Observable<OrderData | null>;
}

export const OrderService = 'oryx.OrderService';

declare global {
  interface InjectionTokensContractMap {
    [OrderService]: OrderService;
  }
}
