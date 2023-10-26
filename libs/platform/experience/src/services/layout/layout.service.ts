import { Observable } from 'rxjs';
import { ResponsiveLayoutInfo } from './layout.model';
import {
  LayoutPluginParams,
  LayoutPluginRender,
  LayoutPluginType,
  LayoutStyleParameters,
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
  data: LayoutStyleParameters;
}

export interface LayoutService {
  getStyles(sheets: ResponsiveLayoutInfo): Observable<string>;
  getRender(config: LayoutIncomingConfig): LayoutPluginRender | undefined;
  getStyleProperties(
    data: LayoutStyleConfig
  ): LayoutStyleProperties | undefined;
}

declare global {
  interface InjectionTokensContractMap {
    [LayoutService]: LayoutService;
  }
}
