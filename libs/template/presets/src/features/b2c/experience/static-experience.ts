import { AppFeature } from '@spryker-oryx/core';
import { provideExperienceData } from '@spryker-oryx/experience';
import { FooterTemplate } from './footer';
import { HeaderTemplate } from './header';
import { HomePage } from './home-page';

export const StaticExperienceFeature: AppFeature = {
  providers: [
    provideExperienceData(HeaderTemplate),
    provideExperienceData(FooterTemplate),
    provideExperienceData(HomePage),
  ],
};
