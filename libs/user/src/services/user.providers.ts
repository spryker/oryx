import { AddressAdapter, DefaultAddressAdapter } from './adapter';
import {
  addressesNormalizers,
  AddressesNormalizers,
  addressNormalizers,
  AddressNormalizers,
} from './adapter/normalizers';
import { addressSerializers, AddressSerializers } from './adapter/serializers';
import { AddressService } from './address.service';
import { DefaultAddressService } from './default-address.service';

export const userProviders = [
  {
    provide: AddressService,
    useClass: DefaultAddressService,
  },
  {
    provide: AddressAdapter,
    useClass: DefaultAddressAdapter,
  },
  {
    provide: AddressesNormalizers,
    useValue: addressesNormalizers,
  },
  {
    provide: AddressNormalizers,
    useValue: addressNormalizers,
  },
  {
    provide: AddressSerializers,
    useValue: addressSerializers,
  },
];
