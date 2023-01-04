import { Provider } from '@spryker-oryx/di';
import {
  AddressAdapter,
  addressesNormalizer,
  AddressFormAdapter,
  addressNormalizer,
  addressSerializers,
  DefaultAddressAdapter,
  DefaultAddressFormAdapter,
} from './adapter';
import { AddressFormService } from './address-form.service';
import { AddressService } from './address.service';
import { componentsProvider } from './components.provider';
import { DefaultAddressFormService } from './default-address-form.service';
import { DefaultAddressService } from './default-address.service';

export const userProviders: Provider[] = [
  componentsProvider,
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
  ...addressesNormalizer,
  ...addressNormalizer,
  ...addressSerializers,
];
