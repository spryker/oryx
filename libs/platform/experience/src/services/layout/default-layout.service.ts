import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { INJECTOR, inject } from '@spryker-oryx/di';
import { LayoutProperties } from '@spryker-oryx/experience/layout';
import { Breakpoint, featureVersion, sizes } from '@spryker-oryx/utilities';
import { Observable, map, merge, of, reduce } from 'rxjs';
import { CompositionLayout } from '../../models';
import { LayoutBuilder } from './layout.builder';
import {
  LayoutStyles,
  ResponsiveLayout,
  ResponsiveLayoutInfo,
} from './layout.model';
import {
  LayoutIncomingConfig,
  LayoutService,
  LayoutStyleConfig,
} from './layout.service';
import {
  LayoutPlugin,
  LayoutPluginRender,
  LayoutPluginType,
  LayoutPropertyPlugin,
} from './plugins';
import { ScreenService } from './screen.service';

interface ResolveLayoutParams {
  token: string;
  data: ResponsiveLayout;
  options: LayoutProperties;
}

export class DefaultLayoutService implements LayoutService {
  constructor(
    protected screenService = inject(ScreenService),
    protected injector = inject(INJECTOR),
    protected layoutBuilder = inject(LayoutBuilder)
  ) {}

  getStyles(
    layoutInfo: ResponsiveLayoutInfo,
    layoutOptions: LayoutProperties
  ): Observable<string> {
    const observables: Observable<string>[] = [];

    const keys = Object.keys(layoutInfo);

    if (keys.length > 0) observables.push(this.resolveCommonStyles());

    keys.forEach((key) => {
      const styles = this.resolveStyles({
        token: key,
        data: layoutInfo[key],
        options: layoutOptions,
      });

      if (styles) {
        observables.push(styles);
      }
    });

    return observables.length > 0
      ? merge(...observables).pipe(reduce((acc, curr) => acc + curr, ''))
      : of('');
  }

  getStylesFromOptions(data: LayoutStyleConfig): Observable<string> {
    const { activeHostOptions, id, rules, composition, screen } = data;

    if (composition) {
      return this.layoutBuilder.getCompositionStyles({
        composition,
        activeHostOptions,
        screen,
      });
    }

    return this.layoutBuilder.getStylesFromOptions({
      rules,
      id,
      activeHostOptions,
      screen,
    });
  }

  getRender(
    config: LayoutIncomingConfig
  ): Observable<LayoutPluginRender | undefined> {
    const { token, type, data } = config;
    return this.getPlugin(token, type)?.getRender?.(data) ?? of(undefined);
  }

  protected resolveCommonStyles(): Observable<string> {
    return ssrAwaiter(
      import('./plugins/base.styles').then((m) => m.styles?.toString() ?? '')
    );
  }

  protected resolveStyles(
    params: ResolveLayoutParams
  ): Observable<string> | void {
    const {
      token,
      data: { included, excluded, type },
      options,
    } = params;

    if (featureVersion >= '1.2') {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.getPlugin(token, type!)
        ?.getStyles?.({ options })
        .pipe(
          map((styles) =>
            this.resolveStylesForBreakpoint(styles, included, excluded)
          )
        );
    }

    return this.legacyResolveStyles(token, included, excluded);
  }

  private legacyResolveStyles(
    layout: string,
    included: Breakpoint[] = [],
    excluded: Breakpoint[] = []
  ): Observable<string> | void {
    switch (layout) {
      case 'bleed':
        return ssrAwaiter(
          import('./plugins/properties/bleed/bleed.styles').then((m) =>
            this.resolveStylesForBreakpoint(m.styles, included, excluded)
          )
        );

      case 'sticky':
        return ssrAwaiter(
          import('./plugins/properties/sticky/sticky.styles').then((m) =>
            this.resolveStylesForBreakpoint(m.styles, included, excluded)
          )
        );

      case 'overlap':
        return ssrAwaiter(
          import('./plugins/properties/overlap/overlap.styles').then((m) =>
            this.resolveStylesForBreakpoint(m.styles, included, excluded)
          )
        );

      case 'divider':
        return ssrAwaiter(
          import('./plugins/properties/divider/divider.styles').then((m) =>
            this.resolveStylesForBreakpoint(m.styles, included, excluded)
          )
        );

      case CompositionLayout.Column:
        return ssrAwaiter(
          import('./plugins/types/column/column-layout.styles').then((m) =>
            this.resolveStylesForBreakpoint(m.styles, included, excluded)
          )
        );

      case CompositionLayout.Grid:
        return ssrAwaiter(
          import('./plugins/types/grid/grid-layout.styles').then((m) =>
            this.resolveStylesForBreakpoint(m.styles, included, excluded)
          )
        );

      case CompositionLayout.Carousel:
        return ssrAwaiter(
          import('./plugins/types/carousel/carousel-layout.styles').then((m) =>
            this.resolveStylesForBreakpoint(m.styles, included, excluded)
          )
        );

      case CompositionLayout.Flex:
        return ssrAwaiter(
          import('./plugins/types/flex/flex-layout.styles').then((m) =>
            this.resolveStylesForBreakpoint(m.styles, included, excluded)
          )
        );

      case CompositionLayout.Split:
        return ssrAwaiter(
          import('./deprecated-split-styles/split-layout.styles').then((m) =>
            this.resolveStylesForBreakpoint(m.styles, included, excluded)
          )
        );

      case CompositionLayout.SplitMain:
        return ssrAwaiter(
          import('./deprecated-split-styles/split-main.styles').then((m) =>
            this.resolveStylesForBreakpoint(m.styles, included, excluded)
          )
        );

      case CompositionLayout.SplitAside:
        return ssrAwaiter(
          import('./deprecated-split-styles/split-aside.styles').then((m) =>
            this.resolveStylesForBreakpoint(m.styles, included, excluded)
          )
        );

      case CompositionLayout.Text:
        return ssrAwaiter(
          import('./plugins/types/text/text-layout.styles').then((m) =>
            this.resolveStylesForBreakpoint(m.styles, included, excluded)
          )
        );
    }
  }

  protected getPlugin(
    token: string,
    type: LayoutPluginType
  ): LayoutPlugin | null {
    return this.injector.inject<LayoutPlugin | null>(
      `${
        type === LayoutPluginType.Layout ? LayoutPlugin : LayoutPropertyPlugin
      }${token}`,
      null
    );
  }

  protected resolveStylesForBreakpoint(
    style: LayoutStyles,
    included: Breakpoint[] = [],
    excluded: Breakpoint[] = []
  ): string {
    let result = '';
    if (style.styles) {
      const query = this.screenService.getScreenMedia(included, excluded);
      if (query) {
        result += `${query} {${style?.styles}}\n`;
      } else {
        result += style?.styles;
      }
    }

    sizes.forEach((size) => {
      if (style[size]) {
        const query = this.screenService.getScreenMedia(size as Breakpoint);
        if (query) {
          result += `${query} {${style[size]}}\n`;
        } else {
          result += style[size];
        }
      }
    });

    return result;
  }
}
