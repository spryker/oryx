import { AppFeature } from '@spryker-oryx/core';
import * as components from './components';
import {
  glueSiteProviders,
  mockSiteProviders,
  siteProviders,
} from './services';
export * from './components';

export const siteComponents = Object.values(components);

export const siteFeature: AppFeature = {
  providers: siteProviders,
  components: siteComponents,
};

export const glueSiteFeature: AppFeature = {
  providers: glueSiteProviders,
  components: siteComponents,
};

export const mockSiteFeature: AppFeature = {
  providers: mockSiteProviders,
  components: siteComponents,
};
