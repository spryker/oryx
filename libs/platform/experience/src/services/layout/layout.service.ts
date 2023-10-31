import { Observable } from 'rxjs';
import { Component, StyleRuleSet } from '../../models';
import { ResponsiveLayoutInfo } from './layout.model';
import {
  LayoutPluginParams,
  LayoutPluginRender,
  LayoutPluginType,
} from './plugins';

export const LayoutService = 'oryx.LayoutService';

export interface LayoutIncomingConfig {
  token: string;
  type: LayoutPluginType;
  data: LayoutPluginParams;
}

export interface LayoutStyleConfig {
  composition?: Component[];
  rules?: StyleRuleSet[];
  id?: string;
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
