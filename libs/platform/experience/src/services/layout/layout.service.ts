import { Observable } from 'rxjs';
import { ResponsiveLayoutInfo } from './layout.model';

export const LayoutService = 'oryx.LayoutService';

export interface LayoutService {
  getStyles(sheets: ResponsiveLayoutInfo): Observable<string>;
}

declare global {
  interface InjectionTokensContractMap {
    [LayoutService]: LayoutService;
  }
}
