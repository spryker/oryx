import { PageMetaResolver } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import {
  DefaultThemeMetaInitializer,
  ThemeMetaInitializer,
} from './initializers';
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
];
