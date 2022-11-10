import { Transformer } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/injector';
import { DeserializedAddress } from '..';
import { Address } from '../../../../models';

export const AddressNormalizer = 'FES.AddressNormalizer*';

export function addressAttributesNormalizer(
  data: DeserializedAddress
): Address {
  return data;
}

export const addressNormalizer: Provider[] = [
  {
    useValue: AddressNormalizer,
    provide: addressAttributesNormalizer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [AddressNormalizer]: Transformer<Address>[];
  }
}
