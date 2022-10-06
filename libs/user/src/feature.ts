import { AppFeature } from '@spryker-oryx/core';
import { userProviders } from './services';

export const userFeature: AppFeature = {
  providers: userProviders,
};
