import { Observable } from 'rxjs';
import { ResponsiveLayoutInfo } from './layout.model';
import {
  LayoutPluginImplementation,
  LayoutPluginRender,
  LayoutPluginType,
} from './plugins';

export const LayoutService = 'oryx.LayoutService';

export interface LayoutService {
  getStyles(sheets: ResponsiveLayoutInfo): Observable<string>;
  getImplementation(
    token: string,
    type: LayoutPluginType
  ): LayoutPluginImplementation | undefined;
  getRender(
    token: string,
    type: LayoutPluginType
  ): LayoutPluginRender | undefined;
}

declare global {
  interface InjectionTokensContractMap {
    [LayoutService]: LayoutService;
  }
}
