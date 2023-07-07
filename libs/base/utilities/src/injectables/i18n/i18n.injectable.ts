import { TemplateResult } from 'lit';
import { DirectiveResult } from 'lit/directive.js';
import { Observable } from 'rxjs';
import { ExtractStrProps } from '../../misc';
import { Injectable } from '../injectable';
import { I18nContextFilter } from './i18n-context-filter';
import { DefaultI18nInjectable } from './i18n-default.injectable';

export const i18nInjectable = new Injectable<I18nInjectable>(
  'oryx.I18nInjectable',
  new DefaultI18nInjectable()
);

export interface I18nInjectable {
  translate<T extends string | readonly string[]>(
    token: T,
    context?: InferI18nContext<T>
  ): I18nTranslation | Observable<I18nTranslation>;
}

export type I18nTranslation = I18nTranslationValue | I18nTranslationResult;
export type I18nTranslationValue = string | DirectiveResult | TemplateResult;

export interface I18nTranslationResult {
  text: I18nTranslationValue;
  hasHtml?: boolean;
}

export type I18nContext = Record<string, I18nContextValue>;
export type I18nContextValue<V = string | number> =
  | V
  | ({ value?: V } & I18nFiltersConfig)
  | undefined
  | null;

export type I18nContextPropStart = '<';
export type I18nContextPropEnd = '>';

/**
 * Convert token type to it's required context type.
 *
 * Properties are marked between `<` and `>`.
 *
 * Filters can be applied to properties using `|`.
 *
 * @example
 * `cart.<count>-items-in-cart` -> { count: unknown }
 * `cart.<token|filter>-items-in-cart` -> { token: { value: unknown, filter: {...} } }
 */
export type InferI18nContext<T extends string | readonly string[]> =
  ResolveContextObject<T>;

declare global {
  /**
   * Extend this interface to add new i18n context filters.
   * Each key is a filter name and value is a {@link I18nContextFilter} type.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface I18nContextFilters {}
}

type ResolveContextObject<T extends string | readonly string[]> =
  T extends string
    ? // Extract context from single token
      {
        [K in ExtractStrProps<
          T,
          I18nContextPropStart,
          I18nContextPropEnd
        >]: I18nContextValue;
      }
    : // Extract context from array of tokens
      {
        [K in keyof T as ExtractStrProps<
          T[K] & string,
          I18nContextPropStart,
          I18nContextPropEnd
        >]: I18nContextValue;
      };

type I18nFiltersConfig = {
  [K in keyof I18nContextFilters as InferI18nFilterName<
    I18nContextFilters[K]
  >]?: InferI18nFilterConfig<I18nContextFilters[K]>;
};

type InferI18nFilterName<F> = F extends I18nContextFilter<infer N, object>
  ? N
  : never;

type InferI18nFilterConfig<F> = F extends I18nContextFilter<string, infer C>
  ? C
  : never;
