import { AppFeature } from '@spryker-oryx/core';
import { provideExperienceData } from '@spryker-oryx/experience';
import { storefrontFeatures } from '@spryker-oryx/presets/storefront';
import { cartsPage } from './experience/carts-page';
import { contactPage } from './experience/contact-page';
import { HeaderTemplate } from './experience/header';

const StaticB2BExperienceFeature: AppFeature = {
  providers: [provideExperienceData([contactPage, HeaderTemplate, cartsPage])],
};

export const b2bStorefrontFeatures: AppFeature[] = [
  ...storefrontFeatures,
  StaticB2BExperienceFeature,
];
