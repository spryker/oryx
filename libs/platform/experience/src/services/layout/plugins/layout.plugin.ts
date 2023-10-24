import { LayoutProperties } from '@spryker-oryx/experience/layout';
import { LitElement, TemplateResult } from 'lit';
import { Observable } from 'rxjs';
import {
  Component,
  ContentComponentSchema,
  StyleProperties,
} from '../../../models';
import { LayoutStyles } from '../layout.model';

export const LayoutPlugin = 'oryx.LayoutPlugin*';
export const LayoutPropertyPlugin = 'oryx.LayoutPropertyPlugin*';

export const enum LayoutPluginType {
  Layout,
  Property,
}

export interface LayoutPluginRender {
  pre?: TemplateResult;
  post?: TemplateResult;
}

export type LayoutPluginImplementation = Record<
  string,
  (...args: unknown[]) => unknown
>;

export interface LayoutPluginConfig {
  name: string;
  schema?: ContentComponentSchema;
}

export type LayoutPluginStyleProperties = Record<string, string | number>;

export interface LayoutPluginParams {
  options?: LayoutProperties;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  element?: LitElement & Record<string, any>;
  experience?: Component;
}

export interface LayoutPlugin {
  getStyles(): Observable<LayoutStyles>;
  getConfig(): LayoutPluginConfig;
  getStyleProperties?(data: StyleProperties): LayoutPluginStyleProperties;
  /**
   * Returns object with implementation methods.
   * Possible usage with additional component.
   *
   * getImplementation(): LayoutPluginImplementation {
   *  return {
   *   method1: () => {},
   *   method2: () => {},
   *  }
   * }
   *
   * Usage LayoutPlugin.getImplementation().method1() | LayoutPlugin.getImplementation().method2()
   */
  getImplementation?(
    data: LayoutPluginParams
  ): LayoutPluginImplementation | undefined;
  /**
   * Returns object with pre and post render templates.
   * Together with composition component it's possible to specify global post\pre render and per component depends on argument.
   * For global render we don't pass component as argument while per component argument is defined.
   *
   * getRender(data: LayoutPluginParams): LayoutPluginRender {
   *   specifying render per component. (first we need guard for checking if data is Component)
   *   if (data === Component) {
   *    return  {
   *      pre: html`<div>pre ${data.id} render</div>`,
   *      post: html`<div>post ${data.id} render</div>`,
   *    }
   *
   *   specifying global render.
   *   return {
   *    pre: html`<div>pre global render</div>`,
   *    post: html`<div>post global render</div>`,
   *   }
   *  }
   * }
   */
  getRender?(data: LayoutPluginParams): LayoutPluginRender | undefined;
}

declare global {
  interface InjectionTokensContractMap {
    [LayoutPlugin]: LayoutPlugin;
    [LayoutPropertyPlugin]: LayoutPlugin;
  }
}
