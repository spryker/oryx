import { inject } from '@spryker-oryx/di';

export const AppEnvironment = 'oryx.Environment';

declare global {
  interface InjectionTokensContractMap {
    [AppEnvironment]: AppEnvironment;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ImportMetaEnv extends AppEnvironment {}

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  interface AppEnvironment {
    readonly [key: string]: string | undefined;
  }
}

/**
 * A shortcut to inject specific key from {@link AppEnvironment}
 * with optional fallback value if it does not exist.
 *
 * @param key A key from {@link AppEnvironment} to inject
 * @param fallbackValue Optional fallback value
 *
 * @example
 * ```ts
 * // First declare the env variable type
 * declare global {
 *   interface AppEnvironment {
 *     readonly MY_ENV?: string;
 *   }
 * }
 *
 * // Then inject it in your service
 * class ExampleService {
 *   constructor(
 *     protected myEnv = injectEnv('MY_ENV', 'fallback')
 *   ) {}
 * }
 * ```
 */
export function injectEnv<K extends keyof AppEnvironment>(
  key: K
): AppEnvironment[K] | undefined;
export function injectEnv<K extends keyof AppEnvironment, D = never>(
  key: K,
  fallbackValue?: D
): NonNullable<AppEnvironment[K]> | D;
export function injectEnv<K extends keyof AppEnvironment, D = never>(
  key: K,
  fallbackValue?: D
): AppEnvironment[K] | D {
  return inject(AppEnvironment, {} as AppEnvironment)[key] ?? fallbackValue;
}
