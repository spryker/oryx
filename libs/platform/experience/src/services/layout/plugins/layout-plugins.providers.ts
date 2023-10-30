import { Provider } from '@spryker-oryx/di';
import { LayoutStylesPlugin } from './layout.plugin';
import {
  BleedLayoutPlugin,
  BleedLayoutPluginToken,
  DividerLayoutPlugin,
  DividerLayoutPluginToken,
  StickyLayoutPlugin,
  StickyLayoutPluginToken,
} from './properties';
import {
  CanvasStylePlugin,
  LayoutStylePlugin,
  SpacingStylePlugin,
  TransformStylePlugin,
  TypographyStylePlugin,
} from './styles';
import {
  CarouselLayoutPlugin,
  CarouselLayoutPluginToken,
  ColumnLayoutPlugin,
  ColumnLayoutPluginToken,
  FlexLayoutPlugin,
  FlexLayoutPluginToken,
  GridLayoutPlugin,
  GridLayoutPluginToken,
  OverlapLayoutPlugin,
  OverlapLayoutPluginToken,
  SplitAsideLayoutPlugin,
  SplitAsideLayoutPluginToken,
  SplitLayoutPlugin,
  SplitLayoutPluginToken,
  SplitMainLayoutPlugin,
  SplitMainLayoutPluginToken,
  TextLayoutPlugin,
  TextLayoutPluginToken,
} from './types';

export const layoutPluginsProviders: Provider[] = [
  {
    provide: LayoutStylesPlugin,
    useClass: CanvasStylePlugin,
  },
  {
    provide: LayoutStylesPlugin,
    useClass: TypographyStylePlugin,
  },
  {
    provide: LayoutStylesPlugin,
    useClass: LayoutStylePlugin,
  },
  {
    provide: LayoutStylesPlugin,
    useClass: SpacingStylePlugin,
  },
  {
    provide: LayoutStylesPlugin,
    useClass: TransformStylePlugin,
  },
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
