import { AppFeature } from '@spryker-oryx/core';
import { pickingComponents } from '@spryker-oryx/picking';
import { mockPickingListProviders } from './src';

export const mockPickingFeature: AppFeature = {
  components: pickingComponents,
  providers: mockPickingListProviders,
};
