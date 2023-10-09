// eslint-disable-next-line @nx/enforce-module-boundaries
import { AppFeature } from '@spryker-oryx/core';
import { formProviders } from './renderers';

export const formFeature: AppFeature = {
  providers: formProviders,
};
