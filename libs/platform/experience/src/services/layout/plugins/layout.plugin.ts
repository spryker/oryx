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

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Layouts {}

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface LayoutProperty {}

  export interface LayoutStylesProperties {
    layout?: LayoutStylesOptions | LayoutTypes;

    // @deprecated since 1.2 will be removed. Use properties from layout object instead.
    vertical?: boolean;
    // @deprecated since 1.2 will be removed. Use properties from layout object instead.
    sticky?: boolean;
    // @deprecated since 1.2 will be removed. Use properties from layout object instead.
    overlap?: boolean;
    // @deprecated since 1.2 will be removed. Use properties from layout object instead.
    bleed?: boolean;
    // @deprecated since 1.2 will be removed. Use properties from layout object instead.
    divider?: boolean;
  }
}

export const LayoutPlugin = 'oryx.LayoutPlugin*';
export const LayoutPropertyPlugin = 'oryx.LayoutPropertyPlugin*';
export const LayoutStylesPlugin = 'oryx.LayoutStylesPlugin*';

// Object is workaround for autocomplete. Typescript incorrect parse metadata when define union and strict type.
// Opened issue https://github.com/Microsoft/TypeScript/issues/29729
// eslint-disable-next-line @typescript-eslint/ban-types
export type LayoutTypes = keyof Layouts | (string & {});

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

export interface LayoutPluginOptionsParams {
  options: LayoutProperties;
}

export interface LayoutPluginRenderParams extends LayoutPluginOptionsParams {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  element?: LitElement & Record<string, any>;
  experience?: Component;
}

export interface LayoutStyleParameters extends Omit<StyleProperties, 'layout'> {
  layout?: LayoutStylesOptions;
}

export interface LayoutPluginPropertiesParams
  extends LayoutPluginOptionsParams {
  styles: LayoutStyleParameters;
}

export interface LayoutPlugin {
  getConfig(): Observable<LayoutPluginConfig>;
  getStyles?(data: LayoutPluginOptionsParams): Observable<LayoutStyles>;
  getStyleProperties?(
    data: LayoutPluginPropertiesParams
  ): Observable<LayoutStyleProperties>;
  getDefaultProperties?(): Observable<LayoutStylesOptions>;
  /**
   * Returns object with pre and post render templates.
   * Together with composition component it's possible to specify global post\pre render and per component depends on argument.
   * For global render we don't pass component as argument while per component argument is defined.
   *
   * getRender(data: LayoutPluginRenderParams): LayoutPluginRender {
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
  getRender?(
    data: LayoutPluginRenderParams
  ): Observable<LayoutPluginRender | undefined>;
}

declare global {
  interface InjectionTokensContractMap {
    [LayoutPlugin]: LayoutPlugin;
    [LayoutPropertyPlugin]: LayoutPlugin;
    [LayoutStylesPlugin]: LayoutPlugin;
  }
}
