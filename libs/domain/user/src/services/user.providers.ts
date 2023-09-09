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
  userSerializers,
} from './adapter';
import { AddressFormService } from './address-form.service';
import { AddressService } from './address.service';
import { DefaultAddressFormService } from './default-address-form.service';
import { DefaultAddressService } from './default-address.service';
import { DefaultRegistrationService } from './default-registration.service';
import { DefaultUserService } from './default-user.service';
import { RegistrationService } from './registration.service';
import { UserResourceResolver } from './resolver';
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
  // {
  //   provide: RegistrationAdapter,
  //   useClass: DefaultRegistrationAdapter,
  // },
  {
    provide: RegistrationService,
    useClass: DefaultRegistrationService,
  },
  ...addressesNormalizer,
  ...addressNormalizer,
  ...addressSerializers,
  ...userSerializers,
  ...userNormalizer,
  UserResourceResolver,
];
