import { AppFeature } from '@spryker-oryx/core';
import {
  experienceCompositionComponent,
  experiencePreviewCompositionComponent,
} from '../composition/src/component';
import { staticPreviewProviders, staticProviders } from './services';

export const experienceFeature: AppFeature = {
  providers: staticProviders,
  components: [experienceCompositionComponent],
};

export const experiencePreviewFeature: AppFeature = {
  providers: staticPreviewProviders,
  components: [experiencePreviewCompositionComponent],
};
