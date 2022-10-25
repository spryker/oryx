export const SsrOptions = 'FES.SsrOptions';

/**
 * Exposes the options used to configure behavior of the server-side rendering and hydration.
 */
export interface SsrOptions {
  /**
   * By default, if SSR rendering is available, initial navigation is skipped.
   * By setting this option to true, initial navigation will be performed. This is useful for triggering
   * client-side rendering.
   */
  initialNavigation?: boolean;
}

declare global {
  interface InjectionTokensContractMap {
    [SsrOptions]: SsrOptions;
  }
}
