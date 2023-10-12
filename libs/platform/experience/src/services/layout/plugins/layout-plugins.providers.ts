import { Provider } from '@spryker-oryx/di';
import { CarouselLayoutPlugin, CarouselLayoutPluginToken } from './carousel';
import { ColumnLayoutPlugin, ColumnLayoutPluginToken } from './column';
import { FlexLayoutPlugin, FlexLayoutPluginToken } from './flex';
import { GridLayoutPlugin, GridLayoutPluginToken } from './grid';
import { SplitLayoutPlugin, SplitLayoutPluginToken } from './split';
import {
  SplitAsideLayoutPlugin,
  SplitAsideLayoutPluginToken,
} from './split-aside';
import {
  SplitMainLayoutPlugin,
  SplitMainLayoutPluginToken,
} from './split-main';
import { TextLayoutPlugin, TextLayoutPluginToken } from './text';

export const layoutPluginsProviders: Provider[] = [
  {
    provide: GridLayoutPluginToken,
    useClass: GridLayoutPlugin,
  },
  {
    provide: CarouselLayoutPluginToken,
    useClass: CarouselLayoutPlugin,
  },
  {
    provide: ColumnLayoutPluginToken,
    useClass: ColumnLayoutPlugin,
  },
  {
    provide: FlexLayoutPluginToken,
    useClass: FlexLayoutPlugin,
  },
  {
    provide: SplitLayoutPluginToken,
    useClass: SplitLayoutPlugin,
  },
  {
    provide: SplitAsideLayoutPluginToken,
    useClass: SplitAsideLayoutPlugin,
  },
  {
    provide: SplitMainLayoutPluginToken,
    useClass: SplitMainLayoutPlugin,
  },
  {
    provide: TextLayoutPluginToken,
    useClass: TextLayoutPlugin,
  },
];
