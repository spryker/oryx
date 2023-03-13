import { ThemeBreakpoints } from '@spryker-oryx/core';
import { Breakpoint } from '../../../models';

export const BreakpointService = 'oryx.BreakpointService';

export interface BreakpointService {
  getBreakpoints(): ThemeBreakpoints;
  getMediaQuery(breakpoint: Breakpoint): string | void;
  getSmallest(): Breakpoint | void;
}

declare global {
  interface InjectionTokensContractMap {
    [BreakpointService]: BreakpointService;
  }
}
