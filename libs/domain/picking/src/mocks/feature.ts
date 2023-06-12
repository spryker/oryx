import { AppFeature } from '@spryker-oryx/core';
import { pickingComponents } from '../feature';
import { mockPickingListProviders } from './src/mock-picking-list.providers';

export const mockPickingFeature: AppFeature = {
  components: pickingComponents,
  providers: mockPickingListProviders,
};
