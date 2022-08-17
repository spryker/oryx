import { AppFeature } from '@spryker-oryx/core';
import {
  experienceCompositionComponent,
  experiencePreviewCompositionComponent,
} from '../components/component';
import { STATIC_PREVIEW_PROVIDERS, STATIC_PROVIDERS } from './services';

export const experienceFeature: AppFeature = {
  providers: STATIC_PROVIDERS,
  components: [experienceCompositionComponent],
};

export const experiencePreviewFeature: AppFeature = {
  providers: STATIC_PREVIEW_PROVIDERS,
  components: [experiencePreviewCompositionComponent],
};
