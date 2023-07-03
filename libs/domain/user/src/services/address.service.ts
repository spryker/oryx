import { Observable } from 'rxjs';
import { Address } from '../models';

export interface AddressService {
  getCurrent(): Observable<Address | null>;
  get(addressId: string): Observable<Address | null>;
  getList(): Observable<Address[] | undefined>;
  add(data: Address): Observable<unknown>;
  update(data: Address): Observable<unknown>;
  delete(data: Address): Observable<unknown>;
}

export const AddressService = 'oryx.AddressService';

declare global {
  interface InjectionTokensContractMap {
    [AddressService]: AddressService;
  }
}
