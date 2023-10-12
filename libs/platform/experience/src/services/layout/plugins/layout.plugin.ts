import { TemplateResult } from 'lit';
import { Observable } from 'rxjs';
import { LayoutStyles } from '../layout.model';

export const LayoutPlugin = 'oryx.LayoutPlugin*';

export interface LayoutPluginRender {
  pre?: TemplateResult;
  post?: TemplateResult;
}

export type LayoutPluginImplementation = Record<
  string,
  (...args: unknown[]) => unknown
>;

export interface LayoutPlugin {
  getStyles(): Observable<LayoutStyles>;
  getImplementation?(): LayoutPluginImplementation;
  getRender?(): LayoutPluginRender;
}

declare global {
  interface InjectionTokensContractMap {
    [LayoutPlugin]: LayoutPlugin;
  }
}
