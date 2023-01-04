import { Serializer } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { Address, ApiAddressModel } from '../../../../models';

export const AddressSerializer = 'FES.AddressSerializer*';

export function addressAttributesSerializer(
  attributes: Address
): Partial<ApiAddressModel.Payload> {
  return {
    type: 'addresses',
    attributes,
  };
}

export const addressSerializers: Provider[] = [
  {
    provide: AddressSerializer,
    useValue: addressAttributesSerializer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [AddressSerializer]: Serializer<Address>[];
  }
}
