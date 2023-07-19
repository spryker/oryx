import { Observable } from 'rxjs';
import { ResponsiveLayoutInfo } from './layout.model';
import { Size } from '@spryker-oryx/utilities';

export const LayoutService = 'oryx.LayoutService';

export interface LayoutService {
  getStyles(sheets: ResponsiveLayoutInfo): Observable<string>;
  getBreakpoint(): Observable<Size>;
}

declare global {
  interface InjectionTokensContractMap {
    [LayoutService]: LayoutService;
  }
}
