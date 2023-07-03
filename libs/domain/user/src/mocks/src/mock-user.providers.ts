import { Provider } from '@spryker-oryx/di';
import {
  AddressAdapter,
  addressesNormalizer,
  AddressFormService,
  addressNormalizer,
  addressSerializers,
  AddressService,
  AddressStateService,
  DefaultAddressAdapter,
  DefaultAddressStateService,
  DefaultUserService,
  UserAdapter,
  UserService,
} from '@spryker-oryx/user';
import { MockAddressFormService } from './mock-address-form.service';
import { MockAddressService } from './mock-address.service';
import { MockDefaultUserAdapter } from './mock-user.adapter';

export const mockUserProviders: Provider[] = [
  {
    provide: AddressService,
    useClass: MockAddressService,
  },
  {
    provide: AddressStateService,
    useClass: DefaultAddressStateService,
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
    provide: UserService,
    useClass: DefaultUserService,
  },
  {
    provide: UserAdapter,
    useClass: MockDefaultUserAdapter,
  },
  ...addressNormalizer,
  ...addressesNormalizer,
  ...addressSerializers,
];
