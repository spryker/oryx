import {
  AppRef,
  Breakpoint,
  ThemeBreakpoints,
  ThemePlugin,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { BreakpointService } from './breakpoint.service';

export class DefaultBreakpointService implements BreakpointService {
  protected themePlugin?: ThemePlugin;

  constructor(protected app = inject(AppRef)) {
    this.themePlugin = this.app.findPlugin(ThemePlugin);
  }

  getMediaQuery(breakpoint: Breakpoint): string | void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.themePlugin!.generateScreenMedia(breakpoint)!;
  }

  getSmallest(): Breakpoint | void {
    return Object.keys(this.getBreakpoints())[0] as Breakpoint;
  }

  getBreakpoints(): ThemeBreakpoints {
    return this.themePlugin?.getBreakpoints() ?? {};
  }
}
