import { AppFeature } from '@spryker-oryx/core';
import { provideLitRoutes } from '@spryker-oryx/router/lit';
import { experienceRoutes } from '../routes';
import {
  experienceFeature,
  experiencePreviewFeature,
  layoutFeature,
} from './feature';

export const layoutLatestFeature = layoutFeature;
export const experienceLatestFeature = experienceFeature;
export const experienceRoutesLatestFeature: AppFeature = {
  providers: [...provideLitRoutes({ routes: experienceRoutes })],
};
export const experiencePreviewLatestFeature = experiencePreviewFeature;
