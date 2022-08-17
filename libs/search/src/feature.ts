import { AppFeature } from '@spryker-oryx/core';
import { searchBoxComponent } from '../box/src/component';
import { searchProviders } from './services';

export const searchFeature: AppFeature = {
  providers: searchProviders,
  components: [searchBoxComponent],
};
