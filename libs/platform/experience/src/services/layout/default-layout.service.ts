import { Breakpoint, ThemeBreakpoints } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import {
  BreakpointService,
  CompositionLayout,
  LayoutStyles,
  ResponsiveLayoutInfo,
} from '@spryker-oryx/experience';
import { Size } from '@spryker-oryx/ui';
import { from, merge, Observable, of } from 'rxjs';
import { reduce } from 'rxjs/operators';

import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { LayoutService } from './layout.service';

export class DefaultLayoutService implements LayoutService {
  constructor(protected breakpointService = inject(BreakpointService)) {}

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
    return from(
      import('./styles/base.styles').then((m) => m.styles?.toString() ?? '')
    );
  }

  // TODO: consider breaking up styles in plugins
  // this allows to add more layouts going forwards without breaking changes,
  // as well as customers can add layouts
  protected resolveStyles(
    layout: string,
    included: Breakpoint[] = [],
    excluded: Breakpoint[] = []
  ): Observable<string> | void {
    switch (layout) {
      case 'bleed':
        return ssrAwaiter(
          import('./styles/bleed.styles').then((m) =>
            this.resolveStylesForBreakpoint(m.styles, included, excluded)
          )
        );

      case 'sticky':
        return ssrAwaiter(
          import('./styles/sticky.styles').then((m) =>
            this.resolveStylesForBreakpoint(m.styles, included, excluded)
          )
        );

      case CompositionLayout.Column:
        return ssrAwaiter(
          import('./styles/column-layout.styles').then((m) =>
            this.resolveStylesForBreakpoint(m.styles, included, excluded)
          )
        );

      case CompositionLayout.Grid:
        return ssrAwaiter(
          import('./styles/grid-layout.styles').then((m) =>
            this.resolveStylesForBreakpoint(m.styles, included, excluded)
          )
        );

      case CompositionLayout.Carousel:
        return ssrAwaiter(
          import('./styles/carousel-layout.styles').then((m) =>
            this.resolveStylesForBreakpoint(m.styles, included, excluded)
          )
        );

      case CompositionLayout.Flex:
        return ssrAwaiter(
          import('./styles/flex-layout.styles').then((m) =>
            this.resolveStylesForBreakpoint(m.styles, included, excluded)
          )
        );

      case CompositionLayout.SplitColumn:
        return ssrAwaiter(
          import('./styles/split-column-layout.styles').then((m) =>
            this.resolveStylesForBreakpoint(m.styles, included, excluded)
          )
        );

      case CompositionLayout.Text:
        return ssrAwaiter(
          import('./styles/text-layout.styles').then((m) =>
            this.resolveStylesForBreakpoint(m.styles, included, excluded)
          )
        );
    }
  }

  protected resolveStylesForBreakpoint(
    style: LayoutStyles,
    included: Breakpoint[],
    excluded: Breakpoint[]
  ): string {
    let result = '';
    if (style.styles) {
      const query = this.breakpointService.getMediaQuery(included, excluded);
      if (query) {
        result += `${query} {${style?.styles}}\n`;
      } else {
        result += style?.styles;
      }
    }

    [Size.Sm, Size.Md, Size.Lg].forEach((size) => {
      if (style[size]) {
        const query = this.breakpointService.getMediaQuery(
          size as unknown as keyof ThemeBreakpoints
        );
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
