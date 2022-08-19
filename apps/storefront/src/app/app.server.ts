import { coreServerProviders } from '@spryker-oryx/core/server';
import { appBuilder } from './app-builder';

export const app = appBuilder
  .withProviders(coreServerProviders)
  .create()
  .catch(console.error);
