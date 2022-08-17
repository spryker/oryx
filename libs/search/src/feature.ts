import { AppFeature } from '@spryker-oryx/core';
import { searchBoxComponent } from '../box/src/component';
import { SEARCH_PROVIDERS } from './services';

export const searchFeature: AppFeature = {
  providers: SEARCH_PROVIDERS,
  components: [searchBoxComponent],
};
