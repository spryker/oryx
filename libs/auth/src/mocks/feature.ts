import { authFeature } from '@spryker-oryx/auth';
import { AppFeature } from '@spryker-oryx/core';
import { mockAuthProviders } from './src';

export const mockAuthFeature: AppFeature = {
  ...authFeature,
  providers: [...(authFeature.providers ?? []), ...mockAuthProviders],
};
