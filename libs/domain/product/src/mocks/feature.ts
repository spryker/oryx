import { AppFeature } from '@spryker-oryx/core';
import { productComponents } from '@spryker-oryx/product';
import { mockProductProviders } from './src/mock-product.providers';

export const mockProductFeature: AppFeature = {
  components: productComponents,
  providers: mockProductProviders,
};
