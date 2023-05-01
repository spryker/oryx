import { Breakpoint, Breakpoints } from '@spryker-oryx/utilities';

export const ScreenService = 'oryx.ScreenService';

export interface ScreenService {
  getBreakpoints(): Breakpoints;
  getScreenMedia(
    include: Breakpoint | Breakpoint[],
    exclude?: Breakpoint | Breakpoint[]
  ): string | void;
  getSmallest(): Breakpoint | void;
}

declare global {
  interface InjectionTokensContractMap {
    [ScreenService]: ScreenService;
  }
}
