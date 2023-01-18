import { Observable } from 'rxjs';
import { Carrier, Shipment } from '../models';

export interface CheckoutShipmentService {
  getShipment(): Observable<Shipment | null>;
  getCarriers(): Observable<Carrier[]>;
  getSelectedShipmentMethod(): Observable<number>;
  setShipmentMethod(method: number): Observable<unknown>;
}

export const CheckoutShipmentService = 'FES.CheckoutShipmentService';

declare global {
  interface InjectionTokensContractMap {
    [CheckoutShipmentService]: CheckoutShipmentService;
  }
}
