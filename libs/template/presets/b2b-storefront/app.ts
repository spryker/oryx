import { AppFeature } from '@spryker-oryx/core';
import { provideExperienceData } from '@spryker-oryx/experience';
import { storefrontFeatures } from '@spryker-oryx/presets/storefront';
import { multiCartFeature } from 'libs/domain/cart/src/extensions/multi-cart';
import { contactPage } from './experience/contact-page';
import { HeaderTemplate } from './experience/header';

const StaticB2BExperienceFeature: AppFeature = {
  providers: [provideExperienceData([contactPage, HeaderTemplate])],
};

export const b2bStorefrontFeatures: AppFeature[] = [
  ...storefrontFeatures,
  multiCartFeature,
  StaticB2BExperienceFeature,
];
