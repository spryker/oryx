import { AppFeature } from '@spryker-oryx/core';
import { searchComponents } from '@spryker-oryx/search';
import { mockSearchProviders } from './src';

export const mockSearchFeature: AppFeature = {
  components: searchComponents,
  providers: mockSearchProviders,
};
