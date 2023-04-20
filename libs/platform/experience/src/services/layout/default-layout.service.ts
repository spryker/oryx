import { ThemeBreakpoints } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import {
  Breakpoint,
  BreakpointService,
  CompositionLayout,
  LayoutStyles,
  ResponsiveLayoutInfo,
} from '@spryker-oryx/experience';
import { Size } from '@spryker-oryx/ui';
import { from, merge, Observable, of } from 'rxjs';
import { reduce } from 'rxjs/operators';

import { LayoutService } from './layout.service';

export class DefaultLayoutService implements LayoutService {
  constructor(protected breakpointService = inject(BreakpointService)) {}

  getStyles(sheets: ResponsiveLayoutInfo): Observable<string> {
    const observables: Observable<string>[] = [];

    const keys = Object.keys(sheets);

    if (keys.length > 0) observables.push(this.resolveCommonStyles());

    keys.forEach((key) => {
      const styles = this.resolveStyles(
        key,
        sheets[key].included,
        sheets[key].excluded
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
        return from(
          import('./styles/bleed.styles').then((m) =>
            this.resolveStylesForBreakpoint(m.styles, included, excluded)
          )
        );

      case 'sticky':
        return from(
          import('./styles/sticky.styles').then((m) =>
            this.resolveStylesForBreakpoint(m.styles, included, excluded)
          )
        );

      case CompositionLayout.Column:
        return from(
          import('./styles/column-layout.styles').then((m) =>
            this.resolveStylesForBreakpoint(m.styles, included, excluded)
          )
        );

      case CompositionLayout.Grid:
        return from(
          import('./styles/grid-layout.styles').then((m) =>
            this.resolveStylesForBreakpoint(m.styles, included, excluded)
          )
        );

      case CompositionLayout.Carousel:
        return from(
          import('./styles/carousel-layout.styles').then((m) =>
            this.resolveStylesForBreakpoint(m.styles, included, excluded)
          )
        );

      case CompositionLayout.Free:
        return from(
          import('./styles/flex-layout.styles').then((m) =>
            this.resolveStylesForBreakpoint(m.styles, included, excluded)
          )
        );

      case CompositionLayout.SplitColumn:
        return from(
          import('./styles/split-column-layout.styles').then((m) =>
            this.resolveStylesForBreakpoint(m.styles, included, excluded)
          )
        );

      case CompositionLayout.Text:
        return from(
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
      // TODO: use a method that allows for both includes and excludes to
      // build efficient media queries
      if (!included.length && !excluded.length) {
        result += style.styles;
      } else {
        const mediaQuery = this.breakpointService.getMediaQuery(included[0]);
        result += `${mediaQuery} {${style?.styles}}\n`;
      }
    }

    [Size.Sm, Size.Md, Size.Lg].forEach((size) => {
      if (style[size]) {
        const mediaQuery = this.breakpointService.getMediaQuery(
          size as unknown as keyof ThemeBreakpoints
        );
        result += `${mediaQuery} {${style[size]?.toString()}}\n`;
      }
    });

    return result;
  }
}
