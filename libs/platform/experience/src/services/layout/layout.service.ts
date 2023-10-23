import { Observable } from 'rxjs';
import { ResponsiveLayoutInfo } from './layout.model';
import {
  LayoutPluginImplementation,
  LayoutPluginParams,
  LayoutPluginRender,
  LayoutPluginStyleProperties,
  LayoutPluginType,
} from './plugins';

export const LayoutService = 'oryx.LayoutService';

export interface LayoutIncomingConfig {
  token: string;
  type: LayoutPluginType;
  data: LayoutPluginParams;
}

export interface LayoutService {
  getStyles(sheets: ResponsiveLayoutInfo): Observable<string>;
  getImplementation(
    config: LayoutIncomingConfig
  ): LayoutPluginImplementation | undefined;
  getRender(config: LayoutIncomingConfig): LayoutPluginRender | undefined;
  getStyleProperties?(
    data: LayoutIncomingConfig
  ): LayoutPluginStyleProperties | undefined;
}

declare global {
  interface InjectionTokensContractMap {
    [LayoutService]: LayoutService;
  }
}
