import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { inject } from '@spryker-oryx/di';
import { Breakpoint, Size, sizes, throttle } from '@spryker-oryx/utilities';
import { merge, Observable, of } from 'rxjs';
import { distinctUntilChanged, reduce } from 'rxjs/operators';
import { CompositionLayout } from '../../models';
import { LayoutStyles, ResponsiveLayoutInfo } from './layout.model';
import { LayoutService } from './layout.service';
import { ScreenService } from './screen.service';

export class DefaultLayoutService implements LayoutService {
  constructor(protected screenService = inject(ScreenService)) {
    this.setupBreakpointsObserver(document.body)
  }

  protected breakpoint?: Observable<Size>;

  protected setupBreakpointsObserver(target: HTMLElement): void {
    if (!target) return;

    this.breakpoint = new Observable<Size>((subscriber) => {
      const observer = new ResizeObserver(() => {
        subscriber.next(this.evaluateBreakpoint(target));
      });
  
      observer.observe(target);
  
      return () => {
        observer.disconnect();
      };
    }).pipe(
      distinctUntilChanged()
    );
  };

  protected evaluateBreakpoint(target: HTMLElement): Size {
    const width = target.clientWidth;
    return Object.entries(this.screenService.getBreakpoints()).find(([_b, {min = 0, max = Infinity}]) => {
      return width >= min && width <= max;
    })![0] as Size;
  }

  getBreakpoint(): Observable<Size> {
    return this.breakpoint!;
  }

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

      case 'overlap':
        return ssrAwaiter(
          import('./styles/overlap.styles').then((m) =>
            this.resolveStylesForBreakpoint(m.styles, included, excluded)
          )
        );

      case 'divider':
        return ssrAwaiter(
          import('./styles/divider.styles').then((m) =>
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

      case CompositionLayout.Split:
        return ssrAwaiter(
          import('./styles/split-layout.styles').then((m) =>
            this.resolveStylesForBreakpoint(m.styles, included, excluded)
          )
        );

      case CompositionLayout.SplitMain:
        return ssrAwaiter(
          import('./styles/split-main.styles').then((m) =>
            this.resolveStylesForBreakpoint(m.styles, included, excluded)
          )
        );

      case CompositionLayout.SplitAside:
        return ssrAwaiter(
          import('./styles/split-aside.styles').then((m) =>
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
