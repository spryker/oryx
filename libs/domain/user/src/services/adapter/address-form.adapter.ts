import { AddressForm } from '@spryker-oryx/user/address-form';
import { Observable } from 'rxjs';
import { AddressFormQualifier } from '../../models';

export interface AddressFormAdapter {
  get: (qualifier: AddressFormQualifier) => Observable<AddressForm>;
}

export const AddressFormAdapter = 'FES.AddressFormAdapter';

declare global {
  interface InjectionTokensContractMap {
    [AddressFormAdapter]: AddressFormAdapter;
  }
}
