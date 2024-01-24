import { AppFeature } from '@spryker-oryx/core';
import { glueProductProviders } from './product/providers';

export const glueFeature: AppFeature = {
  providers: glueProductProviders,
};
