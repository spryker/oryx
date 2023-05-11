import { AppRef } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Breakpoint, Breakpoints } from '@spryker-oryx/utilities';
import { ThemePlugin } from '../../plugins';
import { ScreenService } from './screen.service';

export class DefaultScreenService implements ScreenService {
  protected themePlugin: ThemePlugin;

  constructor(protected app = inject(AppRef)) {
    this.themePlugin = this.app.requirePlugin(ThemePlugin);
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
}
