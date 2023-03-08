import { Provider } from '@spryker-oryx/di';
import {
  AddressAdapter,
  addressesNormalizer,
  AddressFormAdapter,
  addressNormalizer,
  addressSerializers,
  DefaultAddressAdapter,
  DefaultAddressFormAdapter,
  DefaultUserAdapter,
  UserAdapter,
  userNormalizer,
} from './adapter';
import { AddressFormService } from './address-form.service';
import { AddressService } from './address.service';
import { DefaultAddressFormService } from './default-address-form.service';
import { DefaultAddressService } from './default-address.service';
import { DefaultUserService } from './default-user.service';
import { UserService } from './user.service';

export const userProviders: Provider[] = [
  {
    provide: UserService,
    useClass: DefaultUserService,
  },
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
    provide: UserAdapter,
    useClass: DefaultUserAdapter,
  },
  {
    provide: AddressFormService,
    useClass: DefaultAddressFormService,
  },
  ...addressesNormalizer,
  ...addressNormalizer,
  ...addressSerializers,
  ...userNormalizer,
];
