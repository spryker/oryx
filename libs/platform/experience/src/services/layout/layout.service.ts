import { Observable } from 'rxjs';
import { Component, StyleProperties } from '../../models';
import { ResponsiveLayoutInfo } from './layout.model';
import {
  LayoutPluginImplementation,
  LayoutPluginProperties,
  LayoutPluginRender,
  LayoutPluginType,
} from './plugins';

export const LayoutService = 'oryx.LayoutService';

export interface LayoutIncomingConfig {
  token: string;
  type: LayoutPluginType;
  data?: Component | unknown | StyleProperties;
}

export interface LayoutService {
  getStyles(sheets: ResponsiveLayoutInfo): Observable<string>;
  getImplementation(
    config: LayoutIncomingConfig
  ): LayoutPluginImplementation | undefined;
  getRender(config: LayoutIncomingConfig): LayoutPluginRender | undefined;
  getProperties?(
    data: LayoutIncomingConfig
  ): LayoutPluginProperties | undefined;
}

declare global {
  interface InjectionTokensContractMap {
    [LayoutService]: LayoutService;
  }
}
