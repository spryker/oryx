import { AppFeature } from '@spryker-oryx/core';
import { provideExperienceData } from '@spryker-oryx/experience';
import { CartPage } from './cart';
import { FooterTemplate } from './footer';
import { HeaderTemplate } from './header';
import { HomePage } from './home-page';
import { ProductPage } from './pdp';

export const StaticExperienceFeature: AppFeature = {
  providers: [
    provideExperienceData([
      HeaderTemplate,
      FooterTemplate,
      HomePage,
      ProductPage,
      CartPage,
    ]),
  ],
};
