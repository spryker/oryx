import {
  AppBuilder,
  appBuilder,
  DefaultFeatureOptionsService,
  FeatureOptions,
  FeatureOptionsService,
  InjectionPlugin,
} from '@spryker-oryx/core';
import { CliPlugin } from './plugin';
import { cliProviders } from './providers';

export const cliApp = (cliOptions: Record<string, unknown>): AppBuilder =>
  appBuilder()
    .with(
      new InjectionPlugin([
        {
          provide: FeatureOptionsService,
          useClass: DefaultFeatureOptionsService,
        },
        { provide: FeatureOptions, useValue: cliOptions },
        ...cliProviders,
      ])
    )
    .with(new CliPlugin());
