import { AppFeature } from '@spryker-oryx/core';
import { provideLitRoutes } from '@spryker-oryx/router/lit';
import { experienceRoutes } from '../routes';
import {
  experienceComponents,
  experienceFeature,
  experiencePreviewFeature,
  layoutFeature,
} from './1_0';

export const experienceComponents_1_1 = experienceComponents;
export const layoutFeature_1_1 = layoutFeature;
export const experienceRoutesFeature_1_1: AppFeature = {
  providers: [...provideLitRoutes({ routes: experienceRoutes })],
};
export const experienceFeature_1_1 = experienceFeature;
export const experiencePreviewFeature_1_1 = experiencePreviewFeature;
