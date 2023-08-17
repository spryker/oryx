import { AppFeature } from '@spryker-oryx/core';
import { provideLitRoutes } from '@spryker-oryx/router/lit';
import { experienceRoutes } from '../routes';

export const experienceRoutesFeature_1_1: AppFeature = {
  providers: [...provideLitRoutes({ routes: experienceRoutes })],
};
