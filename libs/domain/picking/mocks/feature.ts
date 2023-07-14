import { AppFeature } from '@spryker-oryx/core';
import { pickingComponents } from '@spryker-oryx/picking';
import {
  mockPickingListProviders,
  mockWarehouseUserAssignmentsProviders,
} from './src';
import { MockOfflineDataPlugin } from './src/mock-offline-data-plugin';

export const mockPickingFeature: AppFeature = {
  components: pickingComponents,
  providers: [
    ...mockPickingListProviders,
    ...mockWarehouseUserAssignmentsProviders,
  ],
  plugins: [new MockOfflineDataPlugin()],
};
