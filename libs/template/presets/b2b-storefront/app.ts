import { AppFeature } from '@spryker-oryx/core';
import { provideExperienceData } from '@spryker-oryx/experience';
import { storefrontFeatures } from '@spryker-oryx/presets/storefront';
import { cartCreatePage } from './experience/cart-create-page';
import { contactPage } from './experience/contact-page';

const StaticB2BExperienceFeature: AppFeature = {
  providers: [provideExperienceData([contactPage, cartCreatePage])],
};

export const b2bStorefrontFeatures: AppFeature[] = [
  ...storefrontFeatures,
  StaticB2BExperienceFeature,
];
