import { AppFeature, provideEntity } from '@spryker-oryx/core';
import {
  MerchantContext,
  MerchantService,
  merchantComponents,
} from '@spryker-oryx/merchant';
import { MockMerchantService } from './merchant.service';

export const mockMerchantFeature: AppFeature = {
  components: merchantComponents,
  providers: [
    {
      provide: MerchantService,
      useClass: MockMerchantService,
    },
    provideEntity('merchant', {
      service: MerchantService,
      context: MerchantContext.ID,
    }),
  ],
};
