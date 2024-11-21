import { AppFeature } from '@spryker-oryx/core';
import * as components from './components';
import {
  glueSearchProviders,
  mockSearchProviders,
  searchProviders,
} from './services';
export * from './components';

export const searchComponents = Object.values(components);

export const searchFeature: AppFeature = {
  providers: searchProviders,
  components: searchComponents,
};

export const glueSearchFeature: AppFeature = {
  providers: glueSearchProviders,
  components: searchComponents,
};

export const mockSearchFeature: AppFeature = {
  providers: mockSearchProviders,
  components: searchComponents,
};
