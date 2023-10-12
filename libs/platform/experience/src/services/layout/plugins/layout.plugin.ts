import { TemplateResult } from 'lit';
import { Observable } from 'rxjs';
import { LayoutStyles } from '../layout.model';

export const LayoutPlugin = 'oryx.LayoutPlugin*';

export interface LayoutPlugin {
  getStyles(): Observable<LayoutStyles>;
  getImplementation?(): Record<string, (...args: unknown[]) => unknown>;
  getRender?(): {
    pre?: TemplateResult;
    post?: TemplateResult;
  };
}

declare global {
  interface InjectionTokensContractMap {
    [LayoutPlugin]: LayoutPlugin;
  }
}
