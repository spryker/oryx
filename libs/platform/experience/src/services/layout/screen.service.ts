import { Breakpoint, Breakpoints, Size } from '@spryker-oryx/utilities';
import { Observable } from 'rxjs';

export const ScreenService = 'oryx.ScreenService';

export interface ScreenService {
  getBreakpoints(): Breakpoints;
  getScreenMedia(
    include: Breakpoint | Breakpoint[],
    exclude?: Breakpoint | Breakpoint[]
  ): string | void | null;
  getSmallest(): Breakpoint | void;
  getScreenSize(): Observable<Size | undefined>;
}

declare global {
  interface InjectionTokensContractMap {
    [ScreenService]: ScreenService;
  }
}
