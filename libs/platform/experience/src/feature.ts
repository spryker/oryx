import { AppFeature } from '@spryker-oryx/core';
import { provideLitRoutes } from '@spryker-oryx/router/lit';
import * as components from './components';
import { PreviewPlugin } from './plugins';
import { defaultExperienceRoutes } from './routes';
import {
  experienceLayoutProviders,
  experiencePreviewProviders,
  experienceProviders,
} from './services';

export const experienceComponents = [components.compositionComponent];

export const experienceLayoutFeature: AppFeature = {
  providers: experienceLayoutProviders,
  components: [components.layoutComponent],
};

export const experienceFeature: AppFeature = {
  providers: experienceProviders,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  components: [...experienceComponents, ...experienceLayoutFeature.components!],
};

export const experienceRoutesFeature: AppFeature = {
  providers: [...provideLitRoutes({ routes: defaultExperienceRoutes })],
};

export const experiencePreviewFeature: AppFeature = {
  providers: experiencePreviewProviders,
  components: [components.previewCompositionComponent],
  plugins: [new PreviewPlugin()],
};
