import { AppFeature } from '@spryker-oryx/core';
import { provideLitRoutes } from '@spryker-oryx/router/lit';
import { isVersion } from '@spryker-oryx/utilities';
import * as components from './components';
import { PreviewPlugin } from './plugins';
import { defaultExperienceRoutes, experienceRoutes } from './routes';
import {
  experiencePreviewProviders,
  experienceProviders,
  layoutProviders,
} from './services';

export const experienceComponents = [components.compositionComponent];

export const layoutFeatureFactory = (version: string): AppFeature => {
  return {
    providers: layoutProviders,
    components: [components.layoutComponent],
  };
};

export const experienceFeatureFactory = (version: string): AppFeature => {
  return {
    providers: experienceProviders,
    components: [
      ...experienceComponents,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ...layoutFeatureFactory(version).components!,
    ],
  };
};

export const experienceRoutesFeatureFactory = (version: string): AppFeature => {
  if (isVersion(version, '1.1')) {
    return {
      providers: [...provideLitRoutes({ routes: experienceRoutes })],
    };
  }

  return {
    providers: [...provideLitRoutes({ routes: defaultExperienceRoutes })],
  };
};

export const experiencePreviewFeatureFactory = (
  version: string
): AppFeature => {
  return {
    providers: experiencePreviewProviders,
    components: [components.previewCompositionComponent],
    plugins: [new PreviewPlugin()],
  };
};
