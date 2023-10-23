import { Provider } from '@spryker-oryx/di';
import {
  DefaultMerchantAdapter,
  MerchantAdapter,
  MerchantNormalizer,
} from './adapter';
import { merchantNormalizer } from './adapter/normalizers';
import { DefaultMerchantService } from './default-merchant.service';
import { MerchantContextFallback } from './merchant.context';
import { MerchantService } from './merchant.service';
import { merchantQueries } from './state';

export const merchantProviders: Provider[] = [
  {
    provide: MerchantAdapter,
    useClass: DefaultMerchantAdapter,
  },
  {
    provide: MerchantService,
    useClass: DefaultMerchantService,
  },
  {
    provide: MerchantNormalizer,
    useValue: merchantNormalizer,
  },
  ...merchantQueries,
  MerchantContextFallback,
];
