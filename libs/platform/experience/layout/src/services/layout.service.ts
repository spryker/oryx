import { Observable } from 'rxjs';
import { LayoutStyleSheets } from '../layout.model';

export const LayoutService = 'oryx.LayoutService';

export interface LayoutService {
  getStyles(sheets: LayoutStyleSheets): Observable<string>;
}

declare global {
  interface InjectionTokensContractMap {
    [LayoutService]: LayoutService;
  }
}
