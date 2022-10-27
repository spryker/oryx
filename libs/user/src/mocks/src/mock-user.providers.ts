import { Provider } from '@spryker-oryx/injector';
import {
  AddressAdapter,
  addressesNormalizers,
  AddressesNormalizers,
  AddressFormService,
  addressNormalizers,
  AddressNormalizers,
  addressSerializers,
  AddressSerializers,
  AddressService,
  DefaultAddressAdapter,
  DefaultAddressService,
} from '@spryker-oryx/user';
import { MockAddressFormService } from './mock-address-form.service';

export const mockUserProviders: Provider[] = [
  {
    provide: AddressService,
    useClass: DefaultAddressService,
  },
  {
    provide: AddressAdapter,
    useClass: DefaultAddressAdapter,
  },
  {
    provide: AddressFormService,
    useClass: MockAddressFormService,
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
