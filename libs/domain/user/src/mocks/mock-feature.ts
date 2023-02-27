import { AppFeature } from '@spryker-oryx/core';
import { userComponents } from '@spryker-oryx/user';
import { mockUserProviders } from './src';

export const mockUserFeature: AppFeature = {
  providers: mockUserProviders,
  components: userComponents,
};
