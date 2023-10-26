import { LayoutProperties } from '@spryker-oryx/experience/layout';
import { LazyLoadable } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { Observable } from 'rxjs';
import {
  Component,
  ContentComponentSchema,
  StyleProperties,
} from '../../../models';
import { LayoutStyles, LayoutStylesOptions } from '../layout.model';

export const LayoutPlugin = 'oryx.LayoutPlugin*';
export const LayoutPropertyPlugin = 'oryx.LayoutPropertyPlugin*';
export const LayoutStylePlugin = 'oryx.LayoutStylePlugin*';

export const enum LayoutPluginType {
  Layout,
  Property,
  Style,
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
  schema?: LazyLoadable<ContentComponentSchema>;
}

export interface LayoutStyleOptions {
  unit?: string;
  omitUnit?: boolean;
  emptyValue?: boolean;
}

export type LayoutStyleList = Record<string, string | number | undefined>;
export type LayoutStylePropertiesArr = [LayoutStyleList, LayoutStyleOptions?][];
export type LayoutStyleProperties = LayoutStyleList | LayoutStylePropertiesArr;

export interface LayoutPluginParams {
  options?: LayoutProperties;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  element?: LitElement & Record<string, any>;
  experience?: Component;
}

export interface LayoutStyleParameters extends Omit<StyleProperties, 'layout'> {
  layout?: LayoutStylesOptions;
}

export interface LayoutPlugin {
  getConfig(): Observable<LayoutPluginConfig>;
  getStyles?(): Observable<LayoutStyles>;
  getStyleProperties?(data: LayoutStyleParameters): LayoutStyleProperties;
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
    [LayoutStylePlugin]: LayoutPlugin;
  }
}
