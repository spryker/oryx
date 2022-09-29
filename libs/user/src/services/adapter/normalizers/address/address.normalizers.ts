import { Transformer } from '@spryker-oryx/core';
import { DeserializedAddress } from '../';
import { Address } from '../../../../models';

export const AddressNormalizers = 'FES.AddressNormalizers';

export function addressAttributesNormalizer(
  data: DeserializedAddress
): Address {
  return data;
}

export const addressNormalizers = [addressAttributesNormalizer];

declare global {
  interface InjectionTokensContractMap {
    [AddressNormalizers]: Transformer<Address>[];
  }
}
