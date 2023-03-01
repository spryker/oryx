import { AppFeature } from '@spryker-oryx/core';
import { provideExperienceData } from '@spryker-oryx/experience';
import { FooterTemplate } from './footer';
import { HeaderTemplate } from './header';
import * as pages from './pages';

export const StaticExperienceFeature: AppFeature = {
  providers: [
    provideExperienceData([
      HeaderTemplate,
      FooterTemplate,
      ...Object.values(pages),
    ]),
  ],
};
