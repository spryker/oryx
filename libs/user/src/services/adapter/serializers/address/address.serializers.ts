import { Serializer } from '@spryker-oryx/core';
import { Address, ApiAddressModel } from '../../../../models';

export const AddressSerializers = 'FES.AddressSerializers';

export function addressAttributesSerializer(
  attributes: Address
): Partial<ApiAddressModel.Payload> {
  return {
    type: 'addresses',
    attributes,
  };
}

export const addressSerializers = [addressAttributesSerializer];

declare global {
  interface InjectionTokensContractMap {
    [AddressSerializers]: Serializer<Address>[];
  }
}
