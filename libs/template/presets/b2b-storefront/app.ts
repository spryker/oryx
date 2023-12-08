import { AppFeature } from '@spryker-oryx/core';
import { provideExperienceData } from '@spryker-oryx/experience';
import { storefrontFeatures } from '@spryker-oryx/presets/storefront';
import { contactPage } from './experience/contact-page';
import { HeaderTemplate } from './experience/header';
import { cartCreatePage } from './experience/pages';

const StaticB2BExperienceFeature: AppFeature = {
  providers: [
    provideExperienceData([contactPage, HeaderTemplate, cartCreatePage]),
  ],
};

export const b2bStorefrontFeatures: AppFeature[] = [
  ...storefrontFeatures,
  StaticB2BExperienceFeature,
];
