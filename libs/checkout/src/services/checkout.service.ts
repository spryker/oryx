import { Observable } from 'rxjs';
import { Shipment } from '../models';

export interface CheckoutService {
  getShipments(): Observable<Shipment[] | null>;
  setShipmentMethod(
    method: number,
    shipment: Shipment
  ): Observable<Shipment[] | null>;
}

export const CheckoutService = 'FES.CheckoutService';

declare global {
  interface InjectionTokensContractMap {
    [CheckoutService]: CheckoutService;
  }
}
