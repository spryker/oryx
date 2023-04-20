import { appBuilder, coreFeature } from '@spryker-oryx/core';
import { CliPlugin } from './plugin';
import { cliProviders } from './providers';

export const cliApp = appBuilder()
  .withFeature(coreFeature)
  .withProviders(cliProviders)
  .with(new CliPlugin());
