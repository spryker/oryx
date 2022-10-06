import { cartFeature } from '@spryker-oryx/cart';
import { AppFeature } from '@spryker-oryx/core';
import { mockCartProviders } from './src';

export const mockCartFeature: AppFeature = {
  ...cartFeature,
  providers: [...(cartFeature.providers ?? []), ...mockCartProviders],
};
