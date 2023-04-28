import { appBuilder, coreFeature, InjectionPlugin } from '@spryker-oryx/core';
import { CliPlugin } from './plugin';
import { cliProviders } from './providers';

// TODO: Move modular app?
export const cliApp = appBuilder()
  .with(
    new InjectionPlugin([...cliProviders, ...(coreFeature.providers ?? [])])
  )
  .with([new CliPlugin(), ...(coreFeature.plugins ?? [])]);
