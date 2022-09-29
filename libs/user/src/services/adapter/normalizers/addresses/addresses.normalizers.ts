import { Transformer, TransformerService } from '@spryker-oryx/core';
import { combineLatest, Observable } from 'rxjs';
import { DeserializedAddress } from '../';
import { Address } from '../../../../models';
import { AddressNormalizers } from '../address';

export const AddressesNormalizers = 'FES.AddressesNormalizers';

export function addressesNormalizer(
  data: DeserializedAddress[],
  transformer: TransformerService
): Observable<Address[]> {
  return combineLatest(
    data.map((address) => {
      return transformer.transform<Address>(address, AddressNormalizers);
    })
  );
}

export const addressesNormalizers = [addressesNormalizer];

declare global {
  interface InjectionTokensContractMap {
    [AddressesNormalizers]: Transformer<Address[]>[];
  }
}
