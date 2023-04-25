import { Breakpoint, ThemeBreakpoints } from '@spryker-oryx/core';

export const BreakpointService = 'oryx.BreakpointService';

export interface BreakpointService {
  getBreakpoints(): ThemeBreakpoints;
  getMediaQuery(
    include: Breakpoint | Breakpoint[],
    exclude?: Breakpoint | Breakpoint[]
  ): string | void;
  getSmallest(): Breakpoint | void;
}

declare global {
  interface InjectionTokensContractMap {
    [BreakpointService]: BreakpointService;
  }
}
