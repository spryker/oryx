import {
  AppBuilder,
  appBuilder,
  coreProviders,
  FeatureOptions,
  InjectionPlugin,
} from '@spryker-oryx/core';
import { CliPlugin } from './plugin';
import { cliProviders } from './providers';

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
