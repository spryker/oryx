import { AppFeature } from '@spryker-oryx/core';
import { provideExperienceData } from '@spryker-oryx/experience';
import { storefrontFeatures } from '@spryker-oryx/presets/storefront';
import { createCartsPage } from './experience/cart-create-page';
import { cartsPage } from './experience/carts-page';
import { contactPage } from './experience/contact-page';

const StaticB2BExperienceFeature: AppFeature = {
  providers: [provideExperienceData([contactPage, cartsPage, createCartsPage])],
};

export const b2bStorefrontFeatures: AppFeature[] = [
  ...storefrontFeatures,
  StaticB2BExperienceFeature,
];
