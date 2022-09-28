import { BreakpointService } from './breakpoint.service';
import { Breakpoint, screenSizes } from './constants';

export class DefaultBreakpointService implements BreakpointService {
  getMediaQuery(breakpoint: Breakpoint): string | undefined {
    if (breakpoint === this.getSmallest()) {
      return;
    }

    const screenSize = screenSizes.get(breakpoint);
    if (!screenSize?.min && !screenSize?.max) {
      return;
    }

    let mediaQuery = '@media ';
    const add = (condition: string): void => {
      if (mediaQuery !== '@media ') {
        mediaQuery += ' and ';
      }
      mediaQuery += condition;
    };

    if (screenSize?.min) {
      add(`(min-width: ${screenSize.min}px)`);
    }
    if (screenSize?.max) {
      add(`(max-width: ${screenSize.max}px)`);
    }
    return mediaQuery;
  }

  getSmallest(): Breakpoint {
    // TODO: implement logic to find the smallest breakpoint based
    // on configured screen sizes to allow for custom breakpoints
    return Breakpoint.Xs;
  }
}
