import { AppFeature } from '@spryker-oryx/core';
import { searchFeature } from '@spryker-oryx/search';
import { mockSearchProviders } from './src';

export const mockSearchFeature: AppFeature = {
  ...searchFeature,
  providers: [...(searchFeature.providers ?? []), ...mockSearchProviders],
};
