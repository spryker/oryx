import { AppFeature } from '@spryker-oryx/core';
import { MerchantService, merchantComponents } from '@spryker-oryx/merchant';
import { MockMerchantService } from './merchant.service';

export const mockMerchantFeature: AppFeature = {
  components: merchantComponents,
  providers: [
    {
      provide: MerchantService,
      useClass: MockMerchantService,
    },
  ],
};
