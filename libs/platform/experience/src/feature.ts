import { AppFeature } from '@spryker-oryx/core';
import { provideLitRoutes } from '@spryker-oryx/router/lit';
import * as components from './components';
import { PreviewPlugin } from './plugins';
import { defaultExperienceRoutes } from './routes';
import { experiencePreviewProviders, experienceProviders } from './services';

export const experienceComponents = [
  components.compositionComponent,
  components.layoutComponent,
];

export const experienceFeature: AppFeature = {
  providers: experienceProviders,
  components: experienceComponents,
};

export const experienceRoutesFeature: AppFeature = {
  providers: [...provideLitRoutes({ routes: defaultExperienceRoutes })],
};

export const experiencePreviewFeature: AppFeature = {
  providers: experiencePreviewProviders,
  components: [
    components.previewCompositionComponent,
    components.layoutComponent,
  ],
  plugins: [new PreviewPlugin()],
};
