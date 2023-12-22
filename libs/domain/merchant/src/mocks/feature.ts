import { AppFeature, provideEntity } from '@spryker-oryx/core';
import {
  MerchantContext,
  MerchantService,
  merchantComponents,
} from '@spryker-oryx/merchant';
import { ProductService } from '@spryker-oryx/product';
import { MockMerchantService } from './merchant.service';
import { MockMerchantProductService } from './product.service';

export const mockMerchantFeature: AppFeature = {
  components: merchantComponents,
  providers: [
    {
      provide: MerchantService,
      useClass: MockMerchantService,
    },
    {
      provide: ProductService,
      useClass: MockMerchantProductService,
    },
    provideEntity('merchant', {
      service: MerchantService,
      context: MerchantContext.ID,
    }),
  ],
};
