import {
  AppBuilder,
  appBuilder,
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
        {
          provide: FeatureOptions,
          useValue: cliOptions,
        },
      ])
    )
    .with(new CliPlugin());
