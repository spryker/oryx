export const SsrOptions = 'oryx.SsrOptions';

export const enum Force {
  Partially = 'partially',
  All = 'all',
}

/**
 * Exposes the options used to configure behavior of the server-side rendering and hydration.
 */
export interface SsrOptions {
  /**
   * By default, if SSR rendering is available, initial navigation is skipped.
   * By setting this option to Force.All, hydration will be forced on demand automatically for all components.
   * By setting this option to Force.Partially, hydration will be forced on demand automatically for components which are marked for automatic hydration.
   */
  force?: Force;
}

declare global {
  interface InjectionTokensContractMap {
    [SsrOptions]: SsrOptions;
  }
}
