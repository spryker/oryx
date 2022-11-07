import { AppFeature } from '@spryker-oryx/core';
import { siteComponents } from '@spryker-oryx/site';
import { mockSiteProviders } from './src';

export const mockSiteFeature: AppFeature = {
  providers: mockSiteProviders,
  components: siteComponents,
};
