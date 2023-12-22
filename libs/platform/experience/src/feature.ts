import { AppFeature } from '@spryker-oryx/core';
import { provideLitRoutes } from '@spryker-oryx/router/lit';
import * as components from './components';
import { PreviewPlugin } from './plugins';
import { defaultExperienceRoutes } from './routes';
import {
  experiencePreviewProviders,
  experienceProviders,
  layoutProviders,
} from './services';

export const experienceComponents = [
  components.compositionComponent,
  components.dataText,
  components.dataImage,
  components.dataLink,
];

export const layoutFeature: AppFeature = {
  providers: layoutProviders,
  components: [
    components.layoutComponent,
    components.carouselNavigationComponent,
  ],
};

export const experienceFeature: AppFeature = {
  providers: experienceProviders,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  components: [...experienceComponents, ...layoutFeature.components!],
};

export const experienceRoutesFeature: AppFeature = {
  providers: [...provideLitRoutes({ routes: defaultExperienceRoutes })],
};

export const experiencePreviewFeature: AppFeature = {
  providers: experiencePreviewProviders,
  components: [components.previewCompositionComponent],
  plugins: [new PreviewPlugin()],
};
