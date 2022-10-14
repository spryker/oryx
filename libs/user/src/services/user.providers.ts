import { Provider } from '@spryker-oryx/injector';
import {
  AddressAdapter,
  AddressFormAdapter,
  DefaultAddressAdapter,
  DefaultAddressFormAdapter,
} from './adapter';
import {
  addressesNormalizers,
  AddressesNormalizers,
  addressNormalizers,
  AddressNormalizers,
} from './adapter/normalizers';
import { addressSerializers, AddressSerializers } from './adapter/serializers';
import { AddressFormService } from './address-form.service';
import { AddressService } from './address.service';
import { DefaultAddressFormService } from './default-address-form.service';
import { DefaultAddressService } from './default-address.service';

export const userProviders: Provider[] = [
  {
    provide: AddressService,
    useClass: DefaultAddressService,
  },
  {
    provide: AddressAdapter,
    useClass: DefaultAddressAdapter,
  },
  {
    provide: AddressFormAdapter,
    useClass: DefaultAddressFormAdapter,
  },
  {
    provide: AddressFormService,
    useClass: DefaultAddressFormService,
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
