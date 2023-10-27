import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { INJECTOR, inject } from '@spryker-oryx/di';
import { Breakpoint, sizes } from '@spryker-oryx/utilities';
import { Observable, map, merge, of, reduce } from 'rxjs';
import { LayoutBuilder } from './layout.builder';
import { LayoutStyles, ResponsiveLayoutInfo } from './layout.model';
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
  LayoutStylePlugin,
} from './plugins';
import { ScreenService } from './screen.service';

export class DefaultLayoutService implements LayoutService {
  constructor(
    protected screenService = inject(ScreenService),
    protected stylePlugins = inject(LayoutStylePlugin),
    protected injector = inject(INJECTOR),
    protected layoutBuilder = inject(LayoutBuilder)
  ) {}

  getStyles(layoutInfo: ResponsiveLayoutInfo): Observable<string> {
    const observables: Observable<string>[] = [];

    const keys = Object.keys(layoutInfo);

    if (keys.length > 0) observables.push(this.resolveCommonStyles());

    keys.forEach((key) => {
      const styles = this.resolveStyles(
        key,
        layoutInfo[key].included,
        layoutInfo[key].excluded,
        layoutInfo[key].type
      );

      if (styles) {
        observables.push(styles);
      }
    });

    return observables.length > 0
      ? merge(...observables).pipe(reduce((acc, curr) => acc + curr, ''))
      : of('');
  }

  getStylesFromOptions(data: LayoutStyleConfig): Observable<string> {
    if (data.composition) {
      return this.layoutBuilder.collectStyles(data.composition);
    }

    return this.layoutBuilder.createStylesFromOptions(data.rules, data.id);
  }

  getRender(config: LayoutIncomingConfig): LayoutPluginRender | undefined {
    const { token, type, data } = config;
    return this.getPlugin(token, type)?.getRender?.(data);
  }

  protected resolveCommonStyles(): Observable<string> {
    return ssrAwaiter(
      import('./base.styles').then((m) => m.styles?.toString() ?? '')
    );
  }

  protected resolveStyles(
    token: string,
    included: Breakpoint[] = [],
    excluded: Breakpoint[] = [],
    type: LayoutPluginType
  ): Observable<string> | void {
    return this.getPlugin(token, type)
      ?.getStyles?.()
      .pipe(
        map((styles) =>
          this.resolveStylesForBreakpoint(styles, included, excluded)
        )
      );
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
    included: Breakpoint[],
    excluded: Breakpoint[]
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
