import { Observable } from 'rxjs';
import { ResponsiveLayoutInfo } from './layout.model';
import { LayoutPluginImplementation, LayoutPluginRender } from './plugins';

export const LayoutService = 'oryx.LayoutService';

export interface LayoutService {
  getStyles(sheets: ResponsiveLayoutInfo): Observable<string>;
  getImplementation(token: string): LayoutPluginImplementation | undefined;
  getRender(token: string): LayoutPluginRender | undefined;
}

declare global {
  interface InjectionTokensContractMap {
    [LayoutService]: LayoutService;
  }
}
