import { Observable } from 'rxjs';
import { Carrier, ShipmentMethod } from '../../models';

export interface CheckoutShipmentService {
  /**
   * Exposes the list of shipments by carrier.
   */
  getCarriers(): Observable<Carrier[] | null>;
  select(method: string): void;
  selected(): Observable<ShipmentMethod | null>;
}

export const CheckoutShipmentService = 'oryx.CheckoutShipmentService';

declare global {
  interface InjectionTokensContractMap {
    [CheckoutShipmentService]: CheckoutShipmentService;
  }
}
