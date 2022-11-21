import { Provider } from '@spryker-oryx/injector';
import {
  AddressAdapter,
  addressesNormalizer,
  AddressFormService,
  addressNormalizer,
  addressSerializers,
  AddressService,
  DefaultAddressAdapter,
} from '@spryker-oryx/user';
import { MockAddressFormService } from './mock-address-form.service';
import { MockAddressService } from './mock-address.service';

export const mockUserProviders: Provider[] = [
  {
    provide: AddressService,
    useClass: MockAddressService,
  },
  {
    provide: AddressAdapter,
    useClass: DefaultAddressAdapter,
  },
  {
    provide: AddressFormService,
    useClass: MockAddressFormService,
  },
  ...addressNormalizer,
  ...addressesNormalizer,
  ...addressSerializers,
];
