import { authComponents } from '@spryker-oryx/auth';
import { AppFeature } from '@spryker-oryx/core';
import { mockAuthProviders } from './src';

export const mockAuthFeature: AppFeature = {
  components: authComponents,
  providers: mockAuthProviders,
};
