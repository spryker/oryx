import { ExtractStrProps } from '@spryker-oryx/typescript-utils';
import { Injectable } from '@spryker-oryx/utilities';
import { DirectiveResult } from 'lit/directive.js';
import { DefaultI18nInjectable } from './i18n-default.injectable';

export interface I18nInjectable {
  translate(
    token: string | readonly string[],
    context?: I18nContext
  ): string | DirectiveResult;
}

export const i18nInjectable = new Injectable<I18nInjectable>(
  'FES.I18nInjectable',
  new DefaultI18nInjectable()
);

export type I18nContext = Record<string, unknown>;

/**
 * Convert token type to it's required context type.
 *
 * Properties are marked between `{` and `}`.
 *
 * @example
 * `cart.{count}-items-in-cart` -> { count: unknown }
 */
export type InferI18nContext<T extends string | readonly string[]> =
  (T extends string
    ? // Extract context from single token
      { [K in ExtractStrProps<T, '{', '}'>]: unknown }
    : // Extract context from array of tokens
      { [K in keyof T as ExtractStrProps<T[K] & string, '{', '}'>]: unknown }) &
    I18nContext;
