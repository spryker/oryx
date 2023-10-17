import { TemplateResult } from 'lit';
import { Observable } from 'rxjs';
import { LayoutStyles } from '../layout.model';

export const LayoutPlugin = 'oryx.LayoutPlugin*';
export const LayoutPropertyPlugin = 'oryx.LayoutPropertyPlugin*';

export interface LayoutPluginRender {
  pre?: TemplateResult;
  post?: TemplateResult;
}

export type LayoutPluginImplementation = Record<
  string,
  (...args: unknown[]) => unknown
>;

export interface LayoutPluginConfig {
  name?: string;
  properties?: Record<string, unknown>;
}

export interface LayoutPlugin {
  getStyles(): Observable<LayoutStyles>;
  getConfig(): LayoutPluginConfig;
  getImplementation?(): LayoutPluginImplementation;
  getRender?(): LayoutPluginRender;
}

declare global {
  interface InjectionTokensContractMap {
    [LayoutPlugin]: LayoutPlugin;
    [LayoutPropertyPlugin]: LayoutPlugin;
  }
}
