import { AppFeature } from '@spryker-oryx/core';
import { provideLitRoutes } from '@spryker-oryx/router/lit';
import * as components from '../components';
import { PreviewPlugin } from '../plugins';
import { defaultExperienceLatestRoutes } from '../routes';
import {
  experiencePreviewProviders,
  experienceProviders,
  layoutProviders,
} from '../services';

export const experienceLatestComponents = [components.compositionComponent];

export const layoutLatestFeature: AppFeature = {
  providers: layoutProviders,
  components: [components.layoutComponent],
};

export const experienceLatestFeature: AppFeature = {
  providers: experienceProviders,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  components: [
    ...experienceLatestComponents,
    ...layoutLatestFeature.components!,
  ],
};

export const experienceRoutesLatestFeature: AppFeature = {
  providers: [...provideLitRoutes({ routes: defaultExperienceLatestRoutes })],
};

export const experiencePreviewLatestFeature: AppFeature = {
  providers: experiencePreviewProviders,
  components: [components.previewCompositionComponent],
  plugins: [new PreviewPlugin()],
};
