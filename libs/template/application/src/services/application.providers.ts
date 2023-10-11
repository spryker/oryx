import { PageMetaResolver } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { isServer } from 'lit';
import {
  DefaultThemeMetaInitializer,
  ThemeMetaInitializer,
} from './initializers';
import {
  DefaultCaptureEventsInitializer,
  StopEventsInitializer,
} from './initializers/stop-events.initializer';
import { GlobalPageMetaResolver } from './resolvers';

export const applicationProviders: Provider[] = [
  {
    provide: PageMetaResolver,
    useClass: GlobalPageMetaResolver,
  },
  {
    provide: ThemeMetaInitializer,
    useClass: DefaultThemeMetaInitializer,
  },
  ...(isServer
    ? [
        {
          provide: StopEventsInitializer,
          useClass: DefaultCaptureEventsInitializer,
        },
      ]
    : []),
];
