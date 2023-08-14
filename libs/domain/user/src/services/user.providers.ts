import { Provider } from '@spryker-oryx/di';
import { AccountContextFallback } from './account-context';
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
import { AccountResourceResolver, UserResourceResolver } from './resolver';
import { AddressStateService, DefaultAddressStateService } from './state';
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
  {
    provide: AddressStateService,
    useClass: DefaultAddressStateService,
  },
  ...addressesNormalizer,
  ...addressNormalizer,
  ...addressSerializers,
  ...userNormalizer,
  AccountContextFallback,
  UserResourceResolver,
  AccountResourceResolver,
];
