import { Observable } from 'rxjs';
import { Address } from '../models';

export interface AddressService {
  getCurrentAddress(): Observable<Address | null>;
  getAddress(addressId: string): Observable<Address | null>;
  getAddresses(): Observable<Address[] | null>;
  addAddress(data: Address): Observable<unknown>;
  updateAddress(data: Address): Observable<unknown>;
  deleteAddress(data: Address): Observable<Address>;
  clearCurrentAddress(): Observable<void>;
}

export const AddressService = 'FES.AddressService';

declare global {
  interface InjectionTokensContractMap {
    [AddressService]: AddressService;
  }
}
