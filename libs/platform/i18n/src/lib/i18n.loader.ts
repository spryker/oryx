export interface I18nLoader {
  load(localeId: string): Promise<I18nDataBundle>;
}

/**
 * Partial loader is an optional capability that allows to load
 * only a subset of locale data based on the currently requested tokens.
 *
 * You should always check if specific loader implementation supports this capability
 * using {@link isI18nLoaderPartial()} guard.
 */
export interface I18nPartialLoader extends I18nLoader {
  loadPartial(localeId: string, tokens?: string[]): Promise<I18nDataBundle>;
}

export interface I18nData {
  readonly [token: string]: string;
}

export interface I18nDataBundle {
  readonly [localeId: string]: I18nData;
}

export const I18nLoader = 'oryx.I18nLoader' as const;

declare global {
  interface InjectionTokensContractMap {
    [I18nLoader]: I18nLoader;
  }
}

export function isI18nLoaderPartial(
  loader: I18nLoader
): loader is I18nPartialLoader {
  return typeof (loader as I18nPartialLoader).loadPartial === 'function';
}
