import { Breakpoint, Breakpoints } from '@spryker-oryx/utilities';

export const BreakpointService = 'oryx.BreakpointService';

export interface BreakpointService {
  getBreakpoints(): Breakpoints;
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
