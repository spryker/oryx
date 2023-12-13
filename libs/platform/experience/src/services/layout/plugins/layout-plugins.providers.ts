import { Provider } from '@spryker-oryx/di';
import { LayoutStylesPlugin } from './layout.plugin';
import {
  BleedLayoutPluginToken,
  DividerLayoutPluginToken,
  OverlapLayoutPluginToken,
  StickyLayoutPluginToken,
  TransitionLayoutPluginToken,
} from './properties';
import {
  CarouselLayoutPluginToken,
  ColumnLayoutPluginToken,
  FlexLayoutPluginToken,
  GridLayoutPluginToken,
  ListLayoutPluginToken,
  NavigationLayoutPluginToken,
  SplitLayoutPluginToken,
  TextLayoutPluginToken,
} from './types';

export const layoutPluginsProviders: Provider[] = [
  {
    provide: LayoutStylesPlugin,
    asyncClass: () =>
      import('./styles/canvas/canvas-style.plugin').then(
        (m) => m.CanvasStylePlugin
      ),
  },
  {
    provide: LayoutStylesPlugin,
    asyncClass: () =>
      import('./styles/typography/typography-style.plugin').then(
        (m) => m.TypographyStylePlugin
      ),
  },
  {
    provide: LayoutStylesPlugin,
    asyncClass: () =>
      import('./styles/layout/layout-style.plugin').then(
        (m) => m.LayoutStylePlugin
      ),
  },
  {
    provide: LayoutStylesPlugin,
    asyncClass: () =>
      import('./styles/spacing/spacing-style.plugin').then(
        (m) => m.SpacingStylePlugin
      ),
  },
  {
    provide: LayoutStylesPlugin,
    asyncClass: () =>
      import('./styles/image/image-style.plugin').then(
        (m) => m.ImageStylePlugin
      ),
  },
  {
    provide: LayoutStylesPlugin,
    asyncClass: () =>
      import('./styles/transform/transform-style.plugin').then(
        (m) => m.TransformStylePlugin
      ),
  },
  {
    provide: GridLayoutPluginToken,
    asyncClass: () =>
      import('./types/grid/grid-layout.plugin').then((m) => m.GridLayoutPlugin),
  },
  {
    provide: ListLayoutPluginToken,
    asyncClass: () =>
      import('./types/list/list.plugin').then((m) => m.ListLayoutPlugin),
  },
  {
    provide: CarouselLayoutPluginToken,
    asyncClass: () =>
      import('./types/carousel/carousel-layout.plugin').then(
        (m) => m.CarouselLayoutPlugin
      ),
  },
  {
    provide: ColumnLayoutPluginToken,
    asyncClass: () =>
      import('./types/column/column-layout.plugin').then(
        (m) => m.ColumnLayoutPlugin
      ),
  },
  {
    provide: FlexLayoutPluginToken,
    asyncClass: () =>
      import('./types/flex/flex-layout.plugin').then((m) => m.FlexLayoutPlugin),
  },
  {
    provide: SplitLayoutPluginToken,
    asyncClass: () =>
      import('./types/split/split-layout.plugin').then(
        (m) => m.SplitLayoutPlugin
      ),
  },
  {
    provide: TextLayoutPluginToken,
    asyncClass: () =>
      import('./types/text/text-layout.plugin').then((m) => m.TextLayoutPlugin),
  },
  {
    provide: NavigationLayoutPluginToken,
    asyncClass: () =>
      import('./types/navigation/navigation-layout.plugin').then(
        (m) => m.NavigationLayoutPlugin
      ),
  },
  {
    provide: StickyLayoutPluginToken,
    asyncClass: () =>
      import('./properties/sticky/sticky-layout.plugin').then(
        (m) => m.StickyLayoutPlugin
      ),
  },
  {
    provide: BleedLayoutPluginToken,
    asyncClass: () =>
      import('./properties/bleed/bleed-layout.plugin').then(
        (m) => m.BleedLayoutPlugin
      ),
  },
  {
    provide: DividerLayoutPluginToken,
    asyncClass: () =>
      import('./properties/divider/divider-layout.plugin').then(
        (m) => m.DividerLayoutPlugin
      ),
  },
  {
    provide: OverlapLayoutPluginToken,
    asyncClass: () =>
      import('./properties/overlap/overlap-layout.plugin').then(
        (m) => m.OverlapLayoutPlugin
      ),
  },
  {
    provide: TransitionLayoutPluginToken,
    asyncClass: () =>
      import('./properties/transition/transition.plugin').then(
        (m) => m.TransitionLayoutPlugin
      ),
  },
];
