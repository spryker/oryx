import { AppFeature } from '@spryker-oryx/core';
import {
  experienceCompositionComponent,
  experiencePreviewCompositionComponent,
} from '../composition/src/component';
import { statictPreviewProviders, statictProviders } from './services';

export const experienceFeature: AppFeature = {
  providers: statictProviders,
  components: [experienceCompositionComponent],
};

export const experiencePreviewFeature: AppFeature = {
  providers: statictPreviewProviders,
  components: [experiencePreviewCompositionComponent],
};
