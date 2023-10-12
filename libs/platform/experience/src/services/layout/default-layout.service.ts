import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { INJECTOR, inject } from '@spryker-oryx/di';
import { Breakpoint, sizes } from '@spryker-oryx/utilities';
import { Observable, map, merge, of, reduce } from 'rxjs';
import { LayoutStyles, ResponsiveLayoutInfo } from './layout.model';
import { LayoutService } from './layout.service';
import { LayoutPlugin } from './plugins';
import { ScreenService } from './screen.service';

export class DefaultLayoutService implements LayoutService {
  constructor(
    protected screenService = inject(ScreenService),
    protected injector = inject(INJECTOR)
  ) {}

  getStyles(layoutInfo: ResponsiveLayoutInfo): Observable<string> {
    const observables: Observable<string>[] = [];

    const keys = Object.keys(layoutInfo);

    if (keys.length > 0) observables.push(this.resolveCommonStyles());

    keys.forEach((key) => {
      const styles = this.resolveStyles(
        key,
        layoutInfo[key].included,
        layoutInfo[key].excluded
      );
      if (styles) {
        observables.push(styles);
      }
    });

    return observables.length > 0
      ? merge(...observables).pipe(reduce((acc, curr) => acc + curr, ''))
      : of('');
  }

  protected resolveCommonStyles(): Observable<string> {
    return ssrAwaiter(
      import('./base.styles').then((m) => m.styles?.toString() ?? '')
    );
  }

  protected resolveStyles(
    token: string,
    included: Breakpoint[] = [],
    excluded: Breakpoint[] = []
  ): Observable<string> | void {
    console.log(token, 'resolveStyles');
    return this.getPlugin(token)
      ?.getStyles()
      .pipe(
        map((styles) =>
          this.resolveStylesForBreakpoint(styles, included, excluded)
        )
      );
  }

  protected getPlugin(token: string): LayoutPlugin | null {
    return this.injector.inject<LayoutPlugin | null>(
      `${LayoutPlugin}${token}`,
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
