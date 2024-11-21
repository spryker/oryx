import { AppFeature } from '@spryker-oryx/core';
import * as components from './components';
import {
  cartProviders,
  glueCartProviders,
  mockCartProviders,
} from './services';
export * from './components';

export const cartComponents = Object.values(components);

/**
 * Barebone Cart feature, without connector layer (adapters),
 * designed to work with custom adapters
 */
export const cartFeature: AppFeature = {
  providers: cartProviders,
  components: cartComponents,
};

/**
 * Fully functional Cart feature with Glue connectors included.
 */
export const glueCartFeature: AppFeature = {
  providers: glueCartProviders,
  components: cartComponents,
};

/**
 * Cart feature with mock connectors for testing and quick start
 */
export const mockCartFeature: AppFeature = {
  providers: mockCartProviders,
  components: cartComponents,
};
