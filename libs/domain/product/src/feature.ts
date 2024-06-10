import { AppFeature } from '@spryker-oryx/core';
import * as components from './components';
import {
  glueProductProviders,
  mockProductProviders,
  productProviders,
} from './services';
export * from './components';

export const productComponents = Object.values(components);

export const productFeature: AppFeature = {
  providers: productProviders,
  components: productComponents,
};

export const glueProductFeature: AppFeature = {
  providers: glueProductProviders,
  components: productComponents,
};

export const mockProductFeature: AppFeature = {
  providers: mockProductProviders,
  components: productComponents,
};
