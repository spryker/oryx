import { Observable } from 'rxjs';
import { OrderData } from '../../models';

export interface GetOrderDataProps {
  id: string;
}

export interface OrderAdapter {
  get: (data: GetOrderDataProps) => Observable<OrderData | null>;
}

export const OrderAdapter = 'oryx.OrderAdapter';

declare global {
  interface InjectionTokensContractMap {
    [OrderAdapter]: OrderAdapter;
  }
}
