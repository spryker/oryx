import { LayoutProperties } from '@spryker-oryx/experience/layout';
import { Observable } from 'rxjs';
import { Component } from '../../models';
import { StylesFromOptionsParams } from './layout.builder';
import { ResponsiveLayoutInfo } from './layout.model';
import {
  LayoutPluginRender,
  LayoutPluginRenderParams,
  LayoutPluginType,
} from './plugins';

export const LayoutService = 'oryx.LayoutService';

export interface LayoutIncomingConfig {
  token: string;
  type: LayoutPluginType;
  data: LayoutPluginRenderParams;
}

export interface LayoutStyleConfig extends StylesFromOptionsParams {
  composition?: Component[];
}

export interface LayoutService {
  getStyles(
    sheets: ResponsiveLayoutInfo,
    options?: LayoutProperties
  ): Observable<string>;
  getRender(
    config: LayoutIncomingConfig
  ): Observable<LayoutPluginRender | undefined>;
  getStylesFromOptions(data: LayoutStyleConfig): Observable<string>;
}

declare global {
  interface InjectionTokensContractMap {
    [LayoutService]: LayoutService;
  }
}
