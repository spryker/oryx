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
    console.log(this.themePlugin?.generateMedia(`sm`), 'hello MD rule');
    console.log(this.themePlugin?.generateMedia(`md`), 'hello SM rule');
  }

  getMediaQuery(breakpoint: Breakpoint): string | void {
    if (breakpoint === this.getSmallest()) {
      return;
    }

    return this.themePlugin?.generateMedia(breakpoint);
  }

  getSmallest(): Breakpoint | void {
    return Object.keys(this.getBreakpoints())[0] as Breakpoint;
  }

  getBreakpoints(): ThemeBreakpoints {
    return this.themePlugin?.getBreakpoints() ?? {};
  }
}
