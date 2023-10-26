import { Provider } from '@spryker-oryx/di';
import { BleedLayoutPlugin, BleedLayoutPluginToken } from './bleed';
import { CarouselLayoutPlugin, CarouselLayoutPluginToken } from './carousel';
import { ColumnLayoutPlugin, ColumnLayoutPluginToken } from './column';
import { DividerLayoutPlugin, DividerLayoutPluginToken } from './divider';
import { FlexLayoutPlugin, FlexLayoutPluginToken } from './flex';
import { GridLayoutPlugin, GridLayoutPluginToken } from './grid';
import { OverlapLayoutPlugin, OverlapLayoutPluginToken } from './overlap';
import { SplitLayoutPlugin, SplitLayoutPluginToken } from './split';
import {
  SplitAsideLayoutPlugin,
  SplitAsideLayoutPluginToken,
} from './split-aside';
import {
  SplitMainLayoutPlugin,
  SplitMainLayoutPluginToken,
} from './split-main';
import { StickyLayoutPlugin, StickyLayoutPluginToken } from './sticky';
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
  {
    provide: StickyLayoutPluginToken,
    useClass: StickyLayoutPlugin,
  },
  {
    provide: BleedLayoutPluginToken,
    useClass: BleedLayoutPlugin,
  },
  {
    provide: DividerLayoutPluginToken,
    useClass: DividerLayoutPlugin,
  },
  {
    provide: OverlapLayoutPluginToken,
    useClass: OverlapLayoutPlugin,
  },
];
