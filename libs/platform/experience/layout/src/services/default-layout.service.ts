import { ThemeBreakpoints } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { BreakpointService, CompositionLayout } from '@spryker-oryx/experience';
import { Size } from '@spryker-oryx/ui';
import { from, merge, Observable, of } from 'rxjs';
import { reduce } from 'rxjs/operators';
import { LayoutStyles } from '../layout.model';
import { LayoutService } from './layout.service';

interface ResolvedLayout {
  layout: CompositionLayout;
  screens?: string[];
}

// TODO: consider breaking up styles in plugins
// this allows to add more layouts going forwards without breaking changes,
// as well as customers can add layouts
export class DefaultLayoutService implements LayoutService {
  constructor(protected breakpointService = inject(BreakpointService)) {}

  getStyles(
    layout?: CompositionLayout,
    responsiveLayouts?: { [key: string]: CompositionLayout | undefined }
  ): Observable<string> {
    const observables: Observable<string>[] = [];
    const layouts = this.resolveLayouts(layout, responsiveLayouts);
    layouts.forEach((layout) => {
      const styles = this.resolveStyles(layout);
      if (styles) observables.push(styles);
    });

    return observables.length > 0
      ? merge(...observables).pipe(reduce((acc, curr) => acc + curr, ''))
      : of('');
  }

  protected resolveLayouts(
    layout?: CompositionLayout,
    responsiveLayouts?: { [key: string]: CompositionLayout | undefined }
  ): ResolvedLayout[] {
    const layouts: { layout: CompositionLayout; screens?: string[] }[] = [];
    if (layout) layouts.push({ layout });
    if (responsiveLayouts) {
      Object.keys(responsiveLayouts).forEach((key) => {
        let layout = layouts.find((l) => l.layout === responsiveLayouts?.[key]);
        if (!layout) {
          layouts.push({ layout: responsiveLayouts?.[key]!, screens: [key] });
        } else {
          layout.screens?.push(key);
        }
      });
    }
    return layouts;
  }

  protected resolveStyles(layout: ResolvedLayout): Observable<string> | void {
    const resolve = (styles: LayoutStyles): string => {
      let result = '';

      if (styles.styles) {
        if (styles.base) result += styles.base.toString();
        result += styles.styles.toString();
      }

      // TODO: resolve all sizes from breakpoint service
      [Size.Sm, Size.Md, Size.Lg].forEach((size) => {
        // only add the base styles if not done already
        if (!styles.styles && styles.base)
          result += this.createMediaQuery(size, styles.base.toString());
        if (styles[size]?.base) {
          result += this.createMediaQuery(
            size,
            styles[size]?.base?.toString()!
          );
        }
        if (styles[size]?.styles) {
          result += this.createMediaQuery(
            size,
            styles[size]?.styles?.toString()!
          );
        }
      });
      return result;
    };

    switch (layout?.layout) {
      case CompositionLayout.Grid:
        return from(
          import('../styles/grid.styles').then((m) => resolve(m.styles))
        );

      case CompositionLayout.Carousel:
        return from(
          import('../styles/carousel.styles').then((m) => resolve(m.styles))
        );

      case CompositionLayout.Free:
        return from(
          import('../styles/free.styles').then((m) => resolve(m.styles))
        );

      case CompositionLayout.SplitColumn:
        return from(
          import('../styles/split-column.styles').then((m) => resolve(m.styles))
        );
    }
  }

  protected createMediaQuery(size: Size, content: string): string {
    return `${this.breakpointService.getMediaQuery(
      size as any as keyof ThemeBreakpoints
    )} {${content}}`;
  }
}
