import { AppFeature } from '@spryker-oryx/core';
import {
  experienceCompositionComponent,
  experiencePreviewCompositionComponent,
} from '../composition/src/component';
import { experiencePreviewProviders, experienceProviders } from './services';

export const experienceFeature: AppFeature = {
  providers: experienceProviders,
  components: [experienceCompositionComponent],
};

export const experiencePreviewFeature: AppFeature = {
  providers: experiencePreviewProviders,
  components: [experiencePreviewCompositionComponent],
};
