import {
  AppRef,
  ThemeBreakpoints,
  ThemeDefaultMedia,
  ThemePlugin,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import { Breakpoint } from '../../../models';
import { BreakpointService } from './breakpoint.service';

export class DefaultBreakpointService implements BreakpointService {
  protected themePlugin: ThemePlugin;

  constructor(protected app = inject(AppRef)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.themePlugin = this.app.findPlugin(ThemePlugin)!;
  }

  getMediaQuery(breakpoint: Breakpoint): string | undefined {
    if (breakpoint === this.getSmallest()) {
      return;
    }

    return this.themePlugin.generateMedia(
      `${ThemeDefaultMedia.Screen}.${breakpoint}`
    );
  }

  getSmallest(): Breakpoint {
    return Object.keys(this.getBreakpoints())[0] as Breakpoint;
  }

  getBreakpoints(): ThemeBreakpoints {
    return this.themePlugin.getBreakpoints();
  }
}
