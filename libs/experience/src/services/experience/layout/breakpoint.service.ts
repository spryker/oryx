import { Breakpoint } from './constants';

export const BreakpointService = 'FES.BreakpointService';

export interface BreakpointService {
  getMediaQuery(breakpoint: Breakpoint): string | undefined;
  getSmallest(): Breakpoint;
}

declare global {
  interface InjectionTokensContractMap {
    [BreakpointService]: BreakpointService;
  }
}
