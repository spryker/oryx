import { ThemeBreakpoints } from '@spryker-oryx/core';
import { Breakpoint } from '../../../models';

export const BreakpointService = 'FES.BreakpointService';

export interface BreakpointService {
  getBreakpoints(): ThemeBreakpoints;
  getMediaQuery(breakpoint: Breakpoint): string | undefined;
  getSmallest(): Breakpoint;
}

declare global {
  interface InjectionTokensContractMap {
    [BreakpointService]: BreakpointService;
  }
}
