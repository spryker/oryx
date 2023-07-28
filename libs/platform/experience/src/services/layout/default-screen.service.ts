import { AppRef } from '@spryker-oryx/core';
import { OnDestroy, inject } from '@spryker-oryx/di';
import {
  Breakpoint,
  Breakpoints,
  Size,
  throttle,
} from '@spryker-oryx/utilities';
import { ThemePlugin } from '../../plugins';
import { ScreenService } from './screen.service';
import {
  Observable,
  ReplaySubject,
  distinctUntilChanged,
  map,
  startWith,
} from 'rxjs';

export class DefaultScreenService implements ScreenService, OnDestroy {
  protected themePlugin: ThemePlugin;

  protected observer?: ResizeObserver;
  protected screenWidth$ = new ReplaySubject<number>(1);

  constructor(protected app = inject(AppRef)) {
    this.themePlugin = this.app.requirePlugin(ThemePlugin);
    this.setupBreakpointsObserver(document.body);
  }

  getScreenMedia(
    include: Breakpoint | Breakpoint[],
    exclude: Breakpoint | Breakpoint[] = []
  ): string | void | null {
    return this.themePlugin.generateScreenMedia(include, exclude);
  }

  getSmallest(): Breakpoint | void {
    return Object.keys(this.getBreakpoints())[0] as Breakpoint;
  }

  getBreakpoints(): Breakpoints {
    return this.themePlugin.getBreakpoints();
  }

  getScreenSize(): Observable<Size | undefined> {
    return this.screenWidth$?.pipe(
      startWith(undefined),
      map((width) => this.convertWidthToSize(width)),
      distinctUntilChanged()
    );
  }

  onDestroy(): void {
    this.observer?.disconnect();
  }

  protected setupBreakpointsObserver(target?: HTMLElement): void {
    if (!target) return;

    this.screenWidth$.next(window.innerWidth);

    this.observer = new ResizeObserver(
      throttle(
        () =>
          window.requestAnimationFrame(() => {
            this.screenWidth$.next(window.innerWidth);
          }),
        50
      )
    );
    this.observer.observe(target);
  }

  protected convertWidthToSize(width?: number): Size | undefined {
    if (typeof width === 'undefined') return;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return Object.entries(this.getBreakpoints()).find(
      ([_b, { min = 0, max = Infinity }]) => {
        return width >= min && width <= max;
      }
    )![0] as Size;
  }
}
