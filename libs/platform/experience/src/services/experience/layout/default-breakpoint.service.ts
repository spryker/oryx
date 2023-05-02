import { AppRef } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Breakpoint, Breakpoints } from '@spryker-oryx/utilities';
import { ThemePlugin } from '../../../plugins';
import { BreakpointService } from './breakpoint.service';

export class DefaultBreakpointService implements BreakpointService {
  protected themePlugin?: ThemePlugin;

  constructor(protected app = inject(AppRef)) {
    this.themePlugin = this.app.findPlugin(ThemePlugin);
  }

  getMediaQuery(
    include: Breakpoint | Breakpoint[],
    exclude: Breakpoint | Breakpoint[] = []
  ): string | void {
    if (include === this.getSmallest()) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.themePlugin!.generateScreenMedia(include, exclude)!;
  }

  getSmallest(): Breakpoint | void {
    return Object.keys(this.getBreakpoints())[0] as Breakpoint;
  }

  getBreakpoints(): Breakpoints {
    return this.themePlugin?.getBreakpoints() ?? {};
  }
}
