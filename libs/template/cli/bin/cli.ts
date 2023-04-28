#!/usr/bin/env node

import { CliPlugin, cliProviders } from '@spryker-oryx/cli';
import {
  appBuilder,
  coreFeature,
  FeatureOptions,
  InjectionPlugin,
} from '@spryker-oryx/core';

// TODO: fix it
appBuilder()
  .with(
    new InjectionPlugin([
      ...cliProviders,
      ...(coreFeature.providers ?? []),
      {
        provide: FeatureOptions,
        useValue: { cli: { args: process.argv.slice(2) } },
      },
    ])
  )
  .with([new CliPlugin(), ...(coreFeature.plugins ?? [])])
  .create();
