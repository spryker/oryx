import { AppFeature } from '@spryker-oryx/core';
import * as components from './components';
import { experiencePreviewProviders, experienceProviders } from './services';

export const experienceComponents = [components.experienceCompositionComponent];

export const experienceFeature: AppFeature = {
  providers: experienceProviders,
  components: experienceComponents,
};

export const experiencePreviewFeature: AppFeature = {
  providers: experiencePreviewProviders,
  components: [components.experiencePreviewCompositionComponent],
};
