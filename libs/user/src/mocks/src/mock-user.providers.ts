import { Provider } from '@spryker-oryx/injector';
import {
  AddressAdapter,
  AddressFormService,
  addressSerializers,
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
  ...addressSerializers,
];
