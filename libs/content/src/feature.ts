import { AppFeature } from '@spryker-oryx/core';
import { bannerComponent } from '../banner/src/component';
import { contentLinkComponent } from '../link/src/component';

export const contentFeature: AppFeature = {
  components: [bannerComponent, contentLinkComponent],
};
