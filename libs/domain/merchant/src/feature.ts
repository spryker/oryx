import { AppFeature } from '@spryker-oryx/core';
import * as components from './components';
import { merchantProductProviders } from './product/providers';
import { merchantProviders } from './services';
export * from './components';

export const merchantComponents = Object.values(components);

export const merchantFeature: AppFeature = {
  providers: [...merchantProviders, ...merchantProductProviders],
  components: merchantComponents,
};
