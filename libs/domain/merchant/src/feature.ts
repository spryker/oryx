import { AppFeature } from '@spryker-oryx/core';
import { merchantProductProviders } from './product/providers';
import { merchantProviders } from './services';

export const merchantFeature: AppFeature = {
  providers: [...merchantProviders, ...merchantProductProviders],
};
