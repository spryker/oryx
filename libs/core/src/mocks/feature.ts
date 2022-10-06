import { AppFeature, coreFeature } from '@spryker-oryx/core';
import { mockCoreProviders } from './src';

export const mockCoreFeature: AppFeature = {
  ...coreFeature,
  providers: [...(coreFeature.providers ?? []), ...mockCoreProviders],
};
