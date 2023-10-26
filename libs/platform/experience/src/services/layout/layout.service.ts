import { Observable } from 'rxjs';
import { StyleProperties } from '../../models';
import { ResponsiveLayoutInfo } from './layout.model';
import {
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

export interface LayoutStyleConfig {
  token: string;
  type: LayoutPluginType;
  data: StyleProperties;
}

export interface LayoutService {
  getStyles(sheets: ResponsiveLayoutInfo): Observable<string>;
  getRender(config: LayoutIncomingConfig): LayoutPluginRender | undefined;
  getStyleProperties?(
    data: LayoutStyleConfig
  ): LayoutPluginStyleProperties | undefined;
}

declare global {
  interface InjectionTokensContractMap {
    [LayoutService]: LayoutService;
  }
}
