import { AppFeature } from '@spryker-oryx/core';
import { checkoutProviders } from './services';

export const checkoutFeature: AppFeature = {
  providers: checkoutProviders,
};
