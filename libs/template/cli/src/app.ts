import {
  AppBuilder,
  appBuilder,
  coreProviders,
  FeatureOptions,
  InjectionPlugin,
} from '@spryker-oryx/core';
import { CliPlugin } from './plugin.js';
import { cliProviders } from './providers.js';

export const cliApp = (cliOptions: Record<string, unknown>): AppBuilder =>
  appBuilder()
    .with(
      new InjectionPlugin([
        ...cliProviders,
        ...coreProviders,
        {
          provide: FeatureOptions,
          useValue: cliOptions,
        },
      ])
    )
    .with(new CliPlugin());
