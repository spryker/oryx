import { Observable } from 'rxjs';
import { ResponsiveLayoutInfo } from './layout.model';
import {
  LayoutPluginParams,
  LayoutPluginRender,
  LayoutPluginStyleProperties,
  LayoutPluginType,
  LayoutStyleProperties,
} from './plugins';

export const LayoutService = 'oryx.LayoutService';

export interface LayoutIncomingConfig {
  token: string;
  type: LayoutPluginType;
  data: LayoutPluginParams;
}

export interface LayoutStyleConfig {
  token: string;
  type: LayoutPluginType;
  data: LayoutStyleProperties;
}

export interface LayoutService {
  getStyles(sheets: ResponsiveLayoutInfo): Observable<string>;
  getRender(config: LayoutIncomingConfig): LayoutPluginRender | undefined;
  getStyleProperties(
    data: LayoutStyleConfig
  ): LayoutPluginStyleProperties | undefined;
}

declare global {
  interface InjectionTokensContractMap {
    [LayoutService]: LayoutService;
  }
}
