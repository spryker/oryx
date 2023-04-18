import { Provider } from '@spryker-oryx/di';
import {
  DefaultThemeMetaInitializer,
  ThemeMetaInitializer,
} from './initializers';

export const themesProviders: Provider[] = [
  { provide: ThemeMetaInitializer, useClass: DefaultThemeMetaInitializer },
];
